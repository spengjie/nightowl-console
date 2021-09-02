<template>
  <el-table :data="data" :show-header="false">
    <el-table-column prop="key" />
    <el-table-column prop="value" />
  </el-table>
</template>

<script>
import { fetchNetworkObjectProperties } from '@/api/networkObjects';

export default {
  name: 'Properties',
  props: {
    nnid: {
      type: String,
      required: true,
    },
    redirectOnError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    nnid: {
      handler() {
        this.fetchNetworkObjectProperties();
      },
      immediate: true,
    }
  },
  methods: {
    fetchNetworkObjectProperties() {
      fetchNetworkObjectProperties(this.nnid)
        .then(response => {
          const response_data = response.data;
          const data = [];
          for (const key in response_data) {
            data.push({ key: key, value: response_data[key] });
          }
          this.data = data;
        })
        .catch(error => {
          if (this.redirectOnError && error.response.status === 404) {
            this.$router.replace('/404').catch(() => {});
          }
        });
    }
  }
};
</script>
