export default {
  props: {
    minWidth: {
      type: Number,
      default: 200,
    },
    zIndex: {
      type: Number,
      default: 2,
    }
  },
  data() {
    return {
      visible: false,
      style: {
        left: 0,
        top: 0,
      },
    };
  },
  computed: {
    hasIcon() {
      return this.$children.findIndex(
        child => child.$options.componentName === 'ContextMenuItem' && child.icon) !== -1;
    }
  },
};
