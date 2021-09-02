<template>
  <div class="collapse">
    <div v-if="$slots.header || header" class="collapse__header">
      <i v-if="$slots.default" :class="[{ 'is-collapsed': collapsed }, icon]" class="collapse__icon" @click="handleCollapse" />
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <div v-if="$slots.default" v-show="!collapsed" class="collapse__body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Collapse',
  props: {
    header: String,
    icon: {
      type: String,
      default: 'el-icon-arrow-down',
    },
    defaultCollapsed: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      collapsed: this.defaultCollapsed,
    };
  },
  methods: {
    handleCollapse() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) this.$emit('collapse');
      else this.$emit('expand');
    }
  }
};
</script>
