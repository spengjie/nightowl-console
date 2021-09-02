<template>
  <div style="padding-left: 20px">
    <div class="toolbar" style="margin-bottom: 20px">
      <span style="font-weight: bold">Time Range: </span>
      <el-select v-model="timeRange" style="width: 150px" @change="refresh">
        <el-option
          v-for="timeRangeOption in timeRangeOptions"
          :key="timeRangeOption.value"
          :label="timeRangeOption.label"
          :value="timeRangeOption.value" />
      </el-select>
      <el-button :loading="refreshing" icon="el-icon-refresh" style="margin-left: 6px" @click="refresh" />
    </div>
    <mini-chart
      v-for="item in data"
      :key="item._id"
      :item="{ _id: item._id, name: item.name }"
      :unit="item.data.length > 0 ? item.data[0].unit : undefined"
      :data="item.data"
      @chart-click="viewMonitoringDetails" />
    <el-dialog title="Zabbix Monitoring Details" :visible.sync="monitoringDetailsVisible" width="960px">
      <chart
        :nnid="$route.params && $route.params._id"
        :item="currentMonitorItem" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchZabbixHistoryData } from '@/api/networkObjects';
import MiniChart from '@/views/components/MiniChart';
import Chart from './Chart';

export default {
  name: 'NetworkObjectZabbix',
  components: {
    Chart,
    MiniChart,
  },
  data() {
    return {
      timeRange: 1,
      timeRangeOptions: [
        {
          label: 'Last Hour',
          value: 1,
        },
        {
          label: 'Last 3 Hours',
          value: 3,
        },
        {
          label: 'Last 6 Hours',
          value: 6,
        },
        {
          label: 'Last 24 Hours',
          value: 24,
        },
        {
          label: 'Last 3 Days',
          value: 3 * 24,
        },
        {
          label: 'Last 7 Days',
          value: 7 * 24,
        }
      ],
      refreshing: false,
      data: [],
      monitoringDetailsVisible: false,
      currentMonitorItem: {},
    };
  },
  watch: {
    $route: {
      handler() {
        this.fetchZabbixHistoryData();
      },
      immediate: true,
    }
  },
  methods: {
    fetchZabbixHistoryData() {
      const _id = this.$route.params && this.$route.params._id;
      this.refreshing = true;
      const endTime = new Date();
      const startTime = new Date(new Date(endTime - this.timeRange * 60 * 60 * 1000));
      fetchZabbixHistoryData({
          nnid: _id,
          start_time: startTime,
          end_time: endTime,
        })
        .then(response => {
          this.data = response.data;
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.$router.replace('/404').catch(() => {});
          }
        })
        .finally(() => {
          this.refreshing = false;
        });
    },
    refresh() {
      this.fetchZabbixHistoryData();
    },
    viewMonitoringDetails(event, item) {
      this.currentMonitorItem = item;
      this.monitoringDetailsVisible = true;
    }
  }
};
</script>
