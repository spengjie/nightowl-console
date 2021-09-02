<template>
  <div>
    <div class="toolbar" style="margin-bottom: 10px">
      <span style="font-weight: bold; line-height: 36px">{{ item.name }}</span>
      <span v-if="unit" style="color: #888; line-height: 36px"> ({{ unit }})</span>
      <div class="right-bar">
        <span style="font-weight: bold">Statistic: </span>
        <el-select v-model="statistic" style="width: 150px" @change="refresh">
          <el-option
            v-for="statisticOption in statisticOptions"
            :key="statisticOption"
            :value="statisticOption" />
        </el-select>
        <span style="font-weight: bold">Time Range: </span>
        <el-select v-model="timeRange" style="width: 150px" @change="refresh">
          <el-option
            v-for="timeRangeOption in timeRangeOptions"
            :key="timeRangeOption.value"
            :label="timeRangeOption.label"
            :value="timeRangeOption.value" />
        </el-select>
        <span style="font-weight: bold">Period: </span>
        <el-select v-model="period" style="width: 150px" @change="refresh">
          <el-option
            v-for="periodOption in periodOptions"
            :key="periodOption.value"
            :label="periodOption.label"
            :value="periodOption.value" />
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
import { fetchCloudWatchMetricData } from '@/api/networkObjects';
import { formatDate } from '@/utils/datetime';

export default {
  name: 'CloudWatchMetricChart',
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
      statistic: 'Average',
      statisticOptions: [
        'Average',
        'Minimum',
        'Maximum',
        'Sum',
        'SampleCount',
      ],
      timeRange: 1,
      timeRangeOptions: [
        {
          label: 'Last Hour',
          value: 1,
        },
        {
          label: 'Last 3 Hours',
          value: 3,
        }
      ],
      period: 5 * 60,
      periodOptions: [
        {
          label: '5 Minites',
          value: 5 * 60,
        },
        {
          label: '15 Minites',
          value: 15 * 60,
        },
        {
          label: '1 Hour',
          value: 60 * 60,
        },
        {
          label: '6 Hours',
          value: 6 * 60 * 60,
        },
        {
          label: '24 Hours',
          value: 24 * 60 * 60,
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
        this.fetchCloudWatchMetricData();
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
    fetchCloudWatchMetricData() {
      this.refreshing = true;
      const endTime = new Date();
      const startTime = new Date(new Date(endTime - this.timeRange * 60 * 60 * 1000));
      fetchCloudWatchMetricData({
          nnid: this.nnid,
          metric_name: this.item.name,
          start_time: startTime,
          end_time: endTime,
          period: this.period,
          statistics: [this.statistic],
        })
        .then(response => {
          const data = [];
          const responseData = response.data[0].data;
          responseData.forEach(point => {
            const value = point[this.statistic];
            delete point[this.statistic];
            data.push({
              value,
              ...point,
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
      this.fetchCloudWatchMetricData();
    },
  }
};
</script>
