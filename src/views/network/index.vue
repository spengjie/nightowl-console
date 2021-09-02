<template>
  <el-container>
    <el-aside class="side-pane">
      <explorer :default-value="defaultNodeKey" @change="selectChange" />
    </el-aside>
    <el-main>
      <template v-if="selectedNodeData && selectedNodeData.type === 'Node'">
        <img :src="selectedNodeData && selectedNodeData.icon" style="width: 28px; height: 28px">
        <span style="font-size: 16px; line-height: 28px; height: 28px; display: inline-block; vertical-align: top; margin-left: 10px;">
          {{ selectedNodeData && selectedNodeData.name }}
        </span>
        <el-tabs v-model="activeName" @tab-click="activeNameChange">
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.value"
            :label="tab.label"
            :name="tab.value" />
          <router-view />
        </el-tabs>
      </template>
      <div v-else class="wrapper-center" style="height: 100%">
        Please select a node to view its details.
      </div>
    </el-main>
  </el-container>
</template>

<script>
import Explorer from '@/components/Explorer';

export default {
  name: 'Network',
  components: {
    Explorer,
  },
  data() {
    const _id = this.$route.params && this.$route.params._id;
    const activeName = _id ? this.$route.name : 'networkObjectProperties';
    this.defaultNodeKey = _id;
    return {
      defaultNodeKey: _id,
      activeName,
      selectedNodeData: null,
      tabs: [],
    };
  },
  computed: {
    isAWSService() {
      return this.selectedNodeData
        && this.selectedNodeData.ref_type
        && this.selectedNodeData.ref_type.startsWith('NetworkNode.AWSService.');
    },
    isNetworkDevice() {
      return this.selectedNodeData
        && this.selectedNodeData.ref_type
        && this.selectedNodeData.ref_type.startsWith('NetworkNode.NetworkDevice.');
    }
  },
  methods: {
    selectChange(data) {
      this.selectedNodeData = data;
      const tabs = [{
        label: 'Properties',
        value: 'networkObjectProperties',
      }];
      if (this.isNetworkDevice) {
        tabs.push({
          label: 'Configuration',
          value: 'networkObjectConfiguration',
        });
      }
      if (this.isAWSService) {
        tabs.push({
          label: 'CloudWatch',
          value: 'networkObjectCloudWatch',
        });
      } else {
        tabs.push({
          label: 'Zabbix',
          value: 'networkObjectZabbix',
        });
      }
      this.tabs = tabs;
      if (!this.tabs.find(tab => tab.value === this.activeName)) {
        this.activeName = this.tabs[0].value;
      }
      if (this.selectedNodeData.ref_id) {
        this.$router.push({ name: this.activeName, params: { _id: this.selectedNodeData.ref_id } }).catch(() => {});
      } else {
        this.$router.push({ name: 'network' }).catch(() => {});
      }
    },
    activeNameChange(tab) {
      this.$router.push({ name: tab.name }).catch(() => {});
      this.defaultNodeKey = null;
    }
  }
};
</script>
