<template>
  <div>
    <div class="toolbar" style="margin-bottom: 10px">
      <span style="font-weight: bold; line-height: 36px">{{ item.name }}</span>
      <span v-if="unit" style="color: #888; line-height: 36px"> ({{ unit }})</span>
      <div class="right-bar">
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
    </div>
    <div
      :id="containerId"
      style="height: 500px; border: solid 1px #eee; border-radius: 2px; padding: 3px" />
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
import { v4 as uuid4 } from 'uuid';
import { fetchZabbixHistoryData } from '@/api/networkObjects';
import { formatDate } from '@/utils/datetime';

export default {
  name: 'ZabbixHistoryChart',
  props: {
    nnid: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
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
      containerId: uuid4(),
      chart: null,
      unit: null,
      refreshing: false,
      data: [],
    };
  },
  watch: {
    item: {
      handler() {
        this.fetchZabbixHistoryData();
      },
      immediate: true,
    },
    data: {
      handler(data) {
        this.chart.changeData(data);
        this.unit = data.length > 0 ? data[0].unit : null;
      },
    }
  },
  mounted() {
    const chart = new Chart({
      container: this.containerId,
      autoFit: true,
    });
    chart.data(this.data);
    chart.scale({
      value: {
        nice: true,
      },
      time: {
        nice: true,
        formatter: text => {
          return formatDate(text);
        }
      },
    });
    chart.line().position('time*value');
    chart.render();
    this.chart = chart;
  },
  methods: {
    fetchZabbixHistoryData() {
      this.refreshing = true;
      const endTime = new Date();
      const startTime = new Date(new Date(endTime - this.timeRange * 60 * 60 * 1000));
      fetchZabbixHistoryData({
          nnid: this.nnid,
          _id: this.item._id,
          start_time: startTime,
          end_time: endTime,
        })
        .then(response => {
          const data = [];
          const responseData = response.data[0].data;
          responseData.forEach(item => {
            const value = item.value;
            data.push({
              value,
              ...item,
            });
          });
          this.data = data;
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
  }
};
</script>
