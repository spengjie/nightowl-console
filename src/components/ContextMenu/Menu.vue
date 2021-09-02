<template>
  <transition name="context-menu-fade">
    <div
      v-if="visible"
      class="context-menu context-sub-menu"
      :style="{ left: style.left + 'px', top: style.top + 'px', minWidth: minWidth + 'px', zIndex: zIndex}">
      <slot />
    </div>
  </transition>
</template>

<script>
import menuMixin from './menuMixin';

export default {
  name: 'ContextSubMenu',
  componentName: 'ContextSubMenu',
  mixins: [menuMixin],
  data() {
    return {
      subMenuOffset: 5,
    };
  },
  computed: {
    parentMenuItem() {
      const parent = this.$parent;
      if (parent.$options.componentName === 'ContextMenuItem') {
        return parent;
      }
      return null;
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.close();
      }
    }
  },
  mounted() {
    this.open();
  },
  methods: {
    open() {
      this.visible = true;
      this.$nextTick(() => {
        if (!this.parentMenuItem) return;
        const parentMenuItem = this.parentMenuItem.$el;
        const parentRect = parentMenuItem.getBoundingClientRect();
        const { clientWidth, clientHeight } = document.documentElement;
        if (parentRect.right + this.$el.scrollWidth - this.subMenuOffset > clientWidth) {
          this.style.left = - this.$el.scrollWidth + this.subMenuOffset;
        } else {
          this.style.left = parentMenuItem.clientWidth - this.subMenuOffset;
        }
        if (parentRect.bottom + this.$el.scrollHeight - this.subMenuOffset > clientHeight) {
          this.style.top = - this.$el.scrollHeight + parentMenuItem.offsetTop + parentMenuItem.offsetHeight + this.subMenuOffset;
        } else {
          this.style.top = parentMenuItem.offsetTop - this.subMenuOffset;
        }
      });
    },
    close() {
      this.$destroy();
    }
  }
};
</script>
