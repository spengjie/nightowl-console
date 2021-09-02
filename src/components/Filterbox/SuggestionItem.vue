<template>
  <li
    tabindex="-1"
    class="suggestion-item"
    :class="{ 'is-selected': filterbox.selectedSuggestion === label }"
    @click="handleClick(value, label)">
    <highlight-match :text="label" :match="match" />
    <span v-if="hint" class="hint-text">{{ hint }}</span>
  </li>
</template>

<script>
import HighlightMatch from './HighlightMatch';

export default {
  name: 'SuggestionItem',
  components: { HighlightMatch },
  inject: ['filterbox'],
  props: {
    value: {
      type: String,
      required: true,
    },
    match: String,
    label: {
      type: String,
      default() {
        return this.value;
      },
    },
    hint: String,
  },
  methods: {
    handleClick(value, label) {
      this.$emit('command', value, label);
    }
  }
};
</script>
