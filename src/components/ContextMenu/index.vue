<template>
  <transition name="context-menu-fade">
    <div
      v-if="visible"
      class="context-menu"
      :style="{ left: style.left + 'px', top: style.top + 'px', minWidth: minWidth + 'px', zIndex: zIndex}"
      @contextmenu.prevent>
      <slot />
    </div>
  </transition>
</template>

<script>
import menuMixin from './menuMixin';

export default {
  name: 'ContextMenu',
  componentName: 'ContextMenu',
  mixins: [menuMixin],
  props: {
    event: Event,
    value: {
      type: Boolean,
      default: false,
    }
  },
  provide() {
    return {
      contextMenu: this
    };
  },
  watch: {
    value: {
      handler(value) {
        if (value) {
          this.open();
        } else {
          this.close();
        }
      },
      immediate: true,
    }
  },
  destroyed() {
    this.removeListeners();
  },
  methods: {
    open() {
      this.visible = true;
      this.$nextTick(() => {
        this.addListeners();
        if (!this.event) return;
        const { clientX, clientY } = this.event;
        const { clientWidth, clientHeight } = document.documentElement;
        if (clientX + this.$el.scrollWidth > clientWidth) {
          this.style.left = clientX - this.$el.scrollWidth;
        } else {
          this.style.left = clientX;
        }
        if (clientY + this.$el.scrollHeight > clientHeight) {
          this.style.top = clientY - this.$el.scrollHeight;
        } else {
          this.style.top = clientY;
        }
      });
    },
    close() {
      this.visible = false;
      this.removeListeners();
      this.$emit('input', false);
    },
    clickHandler() {
      this.$nextTick(() => {
        this.close();
      });
    },
    addListeners() {
      if (!this.event) return;
      this.event.target.addEventListener('mousedown', this.clickHandler);
    },
    removeListeners() {
      if (!this.event) return;
      this.event.target.removeEventListener('mousedown', this.clickHandler);
    }
  },
};
</script>
