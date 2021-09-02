<template>
  <el-tooltip :disabled="!showTooltip" :content="text" :placement="placement">
    <span ref="span" class="nowrap-text">
      <slot>
        {{ text }}
      </slot>
    </span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'NowrapText',
  props: {
    text: String,
    placement: {
      type: String,
      default: 'top',
    }
  },
  data() {
    return {
      showTooltip: false,
    };
  },
  watch: {
    text() {
      this.$nextTick(() => {
        this.resetTooltip();
      });
    }
  },
  mounted() {
    this.resetTooltip();
  },
  methods: {
    resetTooltip() {
      const span = this.$refs.span;
      if (span && span.scrollWidth > span.clientWidth) {
        this.showTooltip = true;
      } else {
        this.showTooltip = false;
      }
    }
  }
};
</script>
