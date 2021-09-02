<template>
  <div style="display: flex">
    <el-button type="text" :disabled="page === 0" class="page-button" @click="pageTo(0)">
      <icon icon-class="page-first" />
    </el-button>
    <el-button type="text" :disabled="page === 0" class="page-button" @click="pageTo(page - 1)">
      <icon icon-class="arrow-left" />
    </el-button>
    <span class="summary-text">{{ total !== 0 ? start + 1 : 0 }} - {{ Math.min(start + limit, total) }} of {{ total }}</span>
    <el-button type="text" :disabled="start + limit >= total" class="page-button" @click="pageTo(page + 1)">
      <icon icon-class="arrow-right" />
    </el-button>
    <el-button type="text" :disabled="start + limit >= total" class="page-button" @click="pageTo(Math.ceil(total / limit) - 1)">
      <icon icon-class="page-last" />
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    }
  },
  computed: {
    start() {
      return this.page * this.limit;
    },
  },
  methods: {
    pageTo(page) {
      this.$emit('page-change', page);
    }
  }
};
</script>
