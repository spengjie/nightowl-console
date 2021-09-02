<template>
  <div>
    <el-tag
      v-for="(tag, index) in data"
      :key="tag"
      :closable="editable"
      @close="removeTag(index)">
      {{ tag }}
    </el-tag>
    <el-input
      v-if="adding"
      ref="tagInput"
      v-model="tagInputValue"
      size="mini"
      class="tag-list-input"
      :style="{ marginLeft: data.length ? '10px' : '0' }"
      @keyup.enter.native="addTag"
      @blur="addTag" />
    <el-button
      v-else-if="editable"
      size="mini"
      icon="el-icon-plus"
      class="is-square"
      :style="{ marginLeft: data.length ? '10px' : '0' }"
      @click="onAdd" />
  </div>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      adding: false,
      tagInputValue: '',
    };
  },
  methods: {
    onAdd() {
      this.adding = true;
      this.$nextTick(() => {
        this.$refs.tagInput.$refs.input.focus();
      });
    },
    addTag() {
      let tag = this.tagInputValue;
      if (tag && this.data.indexOf(tag) === -1) {
        this.data.push(tag);
      }
      this.adding = false;
      this.tagInputValue = '';
    },
    removeTag(index) {
      this.data.splice(index, 1);
    },
  }
};
</script>

<style scoped>
.tag-list-input {
  min-width: 30px;
  width: auto;
}
</style>
