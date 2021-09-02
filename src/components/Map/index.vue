<template>
  <div class="map-container">
    <div class="map-main">
      <div class="map-toolbar">
        <el-button size="mini" class="is-square" @click="save">
          <icon icon-class="save" />
        </el-button>
        <div class="right-bar">
          <span>{{ Math.round(zoom * 100) + '%' }}</span>
          <el-button size="mini" icon="el-icon-setting" class="is-square" @click="settingsPaneVisible = !settingsPaneVisible" />
        </div>
      </div>
      <div
        id="map-viewer"
        ref="mapViewer"
        class="map-viewer"
        @drop="drop($event)"
        @contextmenu.prevent>
        <div
          id="minimap-viewer"
          ref="minimapViewer"
          class="minimap-viewer" />
      </div>
    </div>
    <transition name="zoom-in-top-right">
      <div v-if="settingsPaneVisible" class="map-settings">
        <el-checkbox-group v-model="groupVisibilities" @change="updateGroupVisibility">
          <el-checkbox v-for="option in groupVisibilityOptions" :key="option" :label="option">
            {{ option }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </transition>
    <transition name="zoom-in-top-right">
      <div v-if="currentItem" class="map-properties">
        <el-table :data="propertyData" :show-header="false">
          <el-table-column prop="key" :min-width="100" />
          <el-table-column prop="value" :min-width="200" />
        </el-table>
      </div>
    </transition>
    <context-menu v-model="contextMenuVisible" :event="mapContextMenuEvent">
      <context-menu-item
        v-if="mapContextMenuItem && mapContextMenuItem.getType() === 'combo'"
        :label="mapContextMenuItem.getModel().collapsed ? 'Expand' : 'Collapse'"
        @click="collapseExpandCombo" />
      <context-menu-item :label="$t('ui.properties')" @click="viewProperties" />
    </context-menu>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import { ResizeSensor } from 'css-element-queries';
import { fetchNetworkObjectMapData } from '@/api/networkObjects';
import ContextMenu from '@/components/ContextMenu';
import ContextMenuItem from '@/components/ContextMenu/MenuItem';
import './regItem';
import './regBehavior';

export default {
  name: 'Map',
  components: {
    ContextMenu,
    ContextMenuItem,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      contextMenuVisible: false,
      mapContextMenuItem: null,
      mapContextMenuShape: null,
      mapContextMenuEvent: null,
      mapData: {},
      graph: null,
      test: null,
      zoom: 1,
      settingsPaneVisible: false,
      groupVisibilityOptions: [
        'NetworkNode.AWSService.VPC',
        'NetworkNode.AWSService.Subnet',
      ],
      groupVisibilities: [
        'NetworkNode.AWSService.VPC',
        'NetworkNode.AWSService.Subnet',
      ],
      currentItem: null,
      propertyData: [],
    };
  },
  watch: {
    currentItem() {
      const item = this.currentItem;
      if (!item || item.destroyed) return;
      const model = item.getModel();
      const propertyData = [];
      const nom = model.nom;
      if (!nom) return;
      for (const key in nom) {
        propertyData.push({ key: key, value: nom[key] });
      }
      this.propertyData = propertyData;
    }
  },
  mounted() {
    this.createGraph();
  },
  methods: {
    createGraph() {
      const mapViewerEl = this.$refs.mapViewer;
      const minimap = new G6.Minimap({
        container: 'minimap-viewer',
        size: [150, 100],
      });
      const graph = new G6.Graph({
        container: 'map-viewer',
        width: mapViewerEl.clientWidth,
        height: mapViewerEl.clientHeight,
        renderer: 'canvas',
        enabledStack: true,
        // Set groupByTypes to false to get rendering result with reasonable visual zIndex for combos
        groupByTypes: false,
        minZoom: 0.4,
        maxZoom: 2,
        modes: {
          default: [{
            type: 'drag-node',
            onlyChangeComboSize: true,
          },
          {
            type: 'drag-combo',
            onlyChangeComboSize: true,
          },
          'collapse-expand-combo',
          'drag-canvas',
          'drag-combo-node-realtime-update',
          'zoom-canvas-fix-ratio',
        ]},
        plugins: [minimap]
      });

      this.graph = graph;
      graph.on('contextmenu', event => {
        this.mapContextMenuItem = event.item;
        this.contextMenuShape = event.shape;
        if (this.mapContextMenuItem && this.mapContextMenuItem.getType() !== 'edge') {
          this.mapContextMenuEvent = event.originalEvent;
          this.contextMenuVisible = true;
        }
      });
      graph.on('wheelzoom', () => {
        this.zoom = graph.getZoom();
      });
      graph.data(this.mapData);
      graph.render();
      new ResizeSensor(mapViewerEl, this.resizeGraph);
    },
    resizeGraph() {
      const mapViewerEl = this.$refs.mapViewer;
      this.graph.changeSize(mapViewerEl.clientWidth, mapViewerEl.clientHeight);
    },
    save() {
      this.graph.zoom(0.5);
      // this.test = this.graph.save();
    },
    isNN(nomObject) {
      if (typeof(nomObject) === 'string') {
        return nomObject.startsWith('NetworkNode.');
      }
      return nomObject.type.startsWith('NetworkNode.');
    },
    isNL(nomObject) {
      if (typeof(nomObject) === 'string') {
        return nomObject.startsWith('NetworkLink.');
      }
      return nomObject.type.startsWith('NetworkLink.');
    },
    getVisibleGroupId(groups) {
      groups = groups && groups.length > 0 ? groups : [];
      const groupId = null;
      for (const group of groups) {
        if (this.groupVisibilities.includes(group.type))  return group._id;
      }
      return groupId;
    },
    transformToG6Model(nomObject, points) {
      if (this.isNN(nomObject)) {
        let g6Type;
        const g6Model = {};
        const groupId = this.getVisibleGroupId(nomObject.groups);
        if (nomObject.is_group) {
          g6Type = 'combo';
          g6Model.type = 'network_node_as_group';
          g6Model.parentId = groupId;
        } else {
          g6Type = 'node';
          g6Model.type = 'network_node';
          g6Model.comboId = groupId;
        }
        return {
          type: g6Type,
          model: {
            ...g6Model,
            id: nomObject._id,
            label: nomObject.name,
            ...points,
            icon: nomObject.icon,
            color: nomObject.color,
            nom: nomObject,
          }
        };
      }
      if (this.isNL(nomObject)) {
        const g6Type = 'edge';
        const g6Model = {
          style: { stroke: '#7aa7ff' },
          labelCfg: {
            autoRotate: true,
            refX: 20,
            refY: 10,
            position: 'start',
          },
        };
        if (nomObject.type === 'NetworkLink.VPCPeering') {
          g6Model.type = 'vpc_peering';
        } else {
          g6Model.type = 'line';
        }
        return {
          type: g6Type,
          model: {
            ...g6Model,
            id: nomObject._id,
            label: nomObject.name,
            source: nomObject.nn1,
            target: nomObject.nn2,
            icon: nomObject.icon,
            color: nomObject.color,
            nom: nomObject,
          }
        };
      }
    },
    toggleComboVisibility(combo) {
      const type = combo.getType();
      if (type !== 'combo') return;
      const model = combo.getModel();
      if (this.groupVisibilities.includes(model.nom.type)) {
        combo.show();
      } else {
        combo.hide();
      }
    },
    updateGroupVisibility() {
      this.graph.getNodes().forEach(node => {
        const model = node.getModel();
        const newGroupId = this.getVisibleGroupId(model.nom.groups);
        this.graph.updateComboTree(node, newGroupId);
      });
      this.graph.getCombos().forEach(combo => {
        this.toggleComboVisibility(combo);
        const model = combo.getModel();
        const newGroupId = this.getVisibleGroupId(model.nom.groups);
        this.graph.updateComboTree(combo, newGroupId);
      });
      console.log(this.test, this.graph.save())
    },
    find(_id) {
      const g6Item = this.graph.findById(_id);
      if (!g6Item) return undefined;
      const g6Model = g6Item.getModel();
      if (!g6Model) return undefined;
      return g6Model.nom;
    },
    addNetworkObject(nomObject, points) {
      const existing = this.find(nomObject._id);
      if (existing) {
        this.updateNetworkObject(existing, nomObject);
        return;
      }
      const g6Model = this.transformToG6Model(nomObject, points);
      const item = this.graph.addItem(g6Model.type, g6Model.model, true);
      this.toggleComboVisibility(item);
    },
    updateNetworkObject(nomObject, data) {
      Object.assign(nomObject, data);
      console.log(nomObject, data)
      const g6Model = this.transformToG6Model(nomObject);
      this.graph.updateItem(nomObject._id, g6Model.model);
    },
    addMedium(medium) {
      if (this.graph.findById(medium.id)) {
        return;
      }
      const model = {
        // type: 'medium',
        id: medium._id,
        label: medium.name,
        labelCfg: {
          position: 'bottom',
          offset: 8,
        },
        nom: medium,
      };
      this.graph.addItem('node', model, true);
    },
    dropNetworkObject(_id, points) {
      const item = this.graph.findById(_id);
      if (item !== undefined) {
        this.graph.focusItem(item);
        return;
      }
      fetchNetworkObjectMapData(_id).then(response => {
        const networkNodes = response.data.network_nodes;
        const networkLinks = response.data.network_links;
        let { x, y } = points;
        networkNodes.forEach(networkNode => {
          this.addNetworkObject(networkNode, { x, y });
          if (!networkNode.is_group)  x += 120;
        });
        networkLinks.forEach(networkLink => {
          if (!this.find(networkLink.nn1)) return;
          if (networkLink.link_type === 1 && !this.find(networkLink.nn2)) return;
          if (networkLink.link_type === 2) {
            this.addMedium({
              _id: networkLink.nn2,
              name: networkLink.nn2,
            });
          }
          this.addNetworkObject(networkLink);
        });
      });
    },
    drop(event) {
      const nodeData = event.dataTransfer.getData('text');
      if (!nodeData) {
        return;
      }
      const points = this.graph.getPointByClient(event.clientX, event.clientY);
      const { _id, type } = JSON.parse(nodeData);
      if (this.isNN(type)) {
        this.dropNetworkObject(_id, points);
        event.dataTransfer.clearData();
      }
    },
    collapseExpandCombo() {
      const item = this.mapContextMenuItem;
      if (!item || item.destroyed || item.getType() !== 'combo') return;
      const model = item.getModel();
      if (!model.id) return;
      this.graph.collapseExpandCombo(this.mapContextMenuItem);
    },
    viewProperties() {
      const item = this.mapContextMenuItem;
      if (!item || item.destroyed) return;
      this.currentItem = item;
    },
  },
};
</script>
