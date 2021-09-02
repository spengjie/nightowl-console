<template>
  <div style="float: left; margin-bottom: 20px; margin-right: 20px">
    <div style="margin-bottom: 10px; width: 258px">
      <nowrap-text :text="item.name + (unit ? unit : '')">
        <span style="font-weight: bold">{{ item.name }}</span>
        <span v-if="unit" style="color: #888"> ({{ unit }})</span>
      </nowrap-text>
    </div>
    <div
      :id="containerId"
      :style="{ width: width + 'px', height: height + 'px' }"
      style="border: solid 1px #eee; border-radius: 2px; padding: 3px; cursor: pointer"
      @click="handleChartClick" />
  </div>
</template>

<script>
import { Chart } from '@antv/g2';
import { v4 as uuid4 } from 'uuid';
import { formatDate } from '@/utils/datetime';
import NowrapText from '@/components/NowrapText';

export default {
  name: 'MiniChart',
  components: { NowrapText },
  props: {
    item: {
      type: Object,
      required: true,
    },
    unit: String,
    width: {
      type: Number,
      default: 250,
    },
    height: {
      type: Number,
      default: 150,
    },
    data: Array,
  },
  data() {
    return {
      containerId: uuid4(),
      chart: null,
    };
  },
  watch: {
    data: {
      handler(data) {
        this.chart.changeData(data);
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
    handleChartClick(event) {
      this.$emit('chart-click', event, this.item);
    }
  }
};
</script>
