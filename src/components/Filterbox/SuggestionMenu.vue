<template>
  <div v-if="loading" v-loading="loading" style="height: 80px; width: 340px" />
  <ul v-else class="filterbox-suggestion">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'SuggestionMenu',
  props: {
    match: String,
    label: String,
    loading: {
      type: Boolean,
      default: false,
    }
  }
};
</script>
