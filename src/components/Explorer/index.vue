<template>
  <div class="explorer">
    <el-select v-model="selectedExplorerName" class="explorer-select" @change="explorerChange">
      <el-option
        v-for="explorerName in explorerNames"
        :key="explorerName"
        :value="explorerName" />
    </el-select>
    <div class="explorer-tree">
      <el-tree
        ref="explorerTree"
        node-key="path"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        :data="selectedExplorer.nodes"
        highlight-current
        @current-change="change">
        <span
          slot-scope="{ node, data }"
          class="explorer-node"
          :draggable="draggable && canDrag(node, data)"
          @dragstart="dragstart($event, node, data)">
          <icon :icon-class="getIcon(node, data)" style="margin-right: 6px" />
          <span>{{ data.type === 'Folder' ? `${data.name} (${getNumber(data)})` : data.name }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { fetchExplorer, fetchExplorers } from '@/api/explorers';

export default {
  name: 'Explorer',
  props: {
    defaultValue: String,
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      explorerNames: [],
      selectedExplorerName: null,
      selectedExplorer: {nodes: []},
      defaultNodeKey: null,
      defaultExpandedKeys: [],
    };
  },
  created() {
    this.fetchExplorers();
  },
  mounted() {
  },
  methods: {
    fetchExplorers() {
      fetchExplorers()
        .then(response => {
          this.explorerNames = response.data.map(explorer => explorer._id);
          if (response.data.length > 0) {
            this.selectedExplorer = response.data[0];
            this.selectedExplorerName = this.selectedExplorer._id;
            this.$nextTick(() => {
              if (!this.defaultValue) return;
              const defaultNode = this.search(this.defaultValue);
              if (!defaultNode) return;
              this.$refs.explorerTree.setCurrentKey(defaultNode.path);
              this.defaultExpandedKeys = [defaultNode.path];
              this.$emit('change', defaultNode);
            });
          }
        });
    },
    search(ref_id) {

      function searchNode(nodes) {
        if (!nodes) return undefined;
        for (const node of nodes) {
          if (node.ref_id === ref_id) {
            return node;
          }
          const searchedChild = searchNode(node.children);
          if (searchedChild) return searchedChild;
        }
        return undefined;
      }

      if (!this.selectedExplorer) return undefined;
      return searchNode(this.selectedExplorer.nodes);
    },
    getIcon(node, data) {
      if (data.icon) return data.icon;
      if (data.type === 'Folder') {
        if (node.expanded) {
          return 'el-icon-folder-opened';
        }
        return 'el-icon-folder';
      }
      return 'dot';
    },
    getNumber(data) {
      let number = 0;
      const children = data.children || [];
      for (const child of children) {
        if (child.type === 'Node') number++;
        number += this.getNumber(child);
      }
      return number;
    },
    canDrag(node, data) {
      if (!this.draggable) return false;
      if (data.type === 'Folder') return false;
      return true;
    },
    dragstart(event, node, data) {
      event.dataTransfer.setData('text/plain',JSON.stringify({
        type: data.ref_type,
        _id: data.ref_id,
      }));
    },
    explorerChange() {
      fetchExplorer(this.selectedExplorerName)
        .then(response => {
          this.selectedExplorer = response.data;
        });
      this.$emit('explorer-change', this.selectedExplorerName);
    },
    change(data, node) {
      this.$emit('change', data);
    }
  }
};
</script>

<style lang="scss">
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.explorer-select {
  width: 100%;
  margin-bottom: 10px;
}
.explorer-tree {
  user-select: none;
  flex: 1;
  overflow: auto;
  .el-tree-node {
    display: table;
  }
}
.explorer-node {
  width: 100%;
}
</style>
