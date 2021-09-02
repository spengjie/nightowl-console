<template>
  <div class="card" :class="{ 'card-border': border, 'card-shadow': shadow }">
    <div v-if="$slots.header || header" class="card__header" :class="headerClass" :style="headerStyle">
      <slot name="header">
        {{ header }}
      </slot>
    </div>
    <div class="card__body" :class="bodyClass" :style="bodyStyle">
      <slot />
    </div>
    <div v-if="$slots.footer || footer" class="card__footer" :class="footerClass" :style="footerStyle">
      <slot name="footer">
        {{ footer }}
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    header: String,
    footer: String,
    headerClass: [String, Object],
    bodyClass: [String, Object],
    footerClass: [String, Object],
    headerStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    bodyStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    footerStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    shadow: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: false,
    }
  }
};
</script>
