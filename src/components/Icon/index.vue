<template>
  <i v-if="iconType === 'el-icon'" :class="iconClass" />
  <svg v-else class="el-icon-svg" aria-hidden>
    <image v-if="iconType === 'img-url'" :xlink:href="iconClass" class="el-icon-svg" />
    <use v-else :xlink:href="iconName" />
  </svg>
</template>

<script>
const req = require.context('./svg-icons', false, /\.svg$/);
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);

export default {
  name: 'Icon',
  props: {
    iconClass: {
      type: String,
      required: true,
    }
  },
  computed: {
    iconType() {
      if (this.iconClass.startsWith('el-')) {
        return 'el-icon';
      } else if (this.iconClass.startsWith('http') || this.iconClass.startsWith('/')) {
        return 'img-url';
      } else {
        return 'icon-class';
      }
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    }
  },
  install(Vue) {
    Vue.component(this.name, this);
  }
};
</script>
