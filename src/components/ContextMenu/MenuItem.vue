<template>
  <div
    class="context-menu-item"
    :class="{ 'is-disabled': disabled, 'is-divided': divided }"
    @click="handleClick"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <icon v-if="icon" :icon-class="icon" />
    <span class="context-menu-item__label" :class="{ 'icon-padding': !icon && menu.hasIcon }">{{ label }}</span>
    <i v-if="hasChild" class="el-icon-arrow-right context-menu-item__expand" />
    <slot v-if="hovering" />
  </div>
</template>

<script>
export default {
  name: 'ContextMenuItem',
  componentName: 'ContextMenuItem',
  inject: ['contextMenu'],
  props: {
    icon: String,
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    divided: {
      type: Boolean,
      default: false,
    },
    iconPadding: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      hovering: false,
      hasChild: false,
    };
  },
  computed: {
    menu() {
      const parent = this.$parent;
      if (['ContextMenu', 'ContextSubMenu'].indexOf(parent.$options.componentName) !== -1) {
        return parent;
      }
      return null;
    }
  },
  mounted() {
    this.hasChild = this.$slots.default;
  },
  methods: {
    handleClick() {
      this.$emit('click');
      if (!this.hasChild) this.contextMenu.close();
    }
  }
};
</script>

<style>

</style>
