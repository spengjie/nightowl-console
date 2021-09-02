<template>
  <span>
    {{ highlighted.left }}<span class="highlight-text">{{ highlighted.match }}</span>{{ highlighted.right }}
  </span>
</template>

<script>
export default {
  name: 'HighlightMatch',
  props: {
    text: {
      type: String,
      required: true,
    },
    match: {
      type: String,
    }
  },
  computed: {
    highlighted() {
      let left = this.text;
      let match = '';
      let right = '';
      if (this.match) {
        const index = this.text.toLowerCase().indexOf(this.match.toLowerCase());
        if (index > -1) {
          const matchLen = this.match.length;
          left = this.text.slice(0, index);
          match = this.text.slice(index, index + matchLen);
          right = this.text.slice(index + matchLen);
        }
      }
      return { left, match, right };
    }
  }
};
</script>
