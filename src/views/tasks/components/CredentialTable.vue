<template>
  <div>
    <el-form-item :prop="useAllItemProp" required>
      <el-switch v-model="data.use_all" :active-text="$t('ui.useAllCredentials')" />
    </el-form-item>
    <el-form-item :prop="credentialsItemProp" :required="!data.use_all">
      <div v-if="loading" v-loading="loading" class="table-loading" />
      <el-table v-show="!loading" ref="credentialTable" :data="credentials" @selection-change="onSelectionChange">
        <el-table-column v-if="!data.use_all" type="selection" width="55" />
        <el-table-column prop="alias" :label="$t('ui.alias')" />
        <el-table-column
          v-for="column in columns"
          :key="column"
          :prop="column"
          :label="$t('uiProfile.' + column)" />
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import { fetchCredentialsByType } from '@/api/credentials';

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    useAllItemProp: {
      type: String,
      required: true,
    },
    credentialsItemProp: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      columns: [],
      credentials: [],
    };
  },
  created() {
    this.fetchCredentialsByType();
  },
  methods: {
    fetchCredentialsByType() {
      this.loading = true;
      fetchCredentialsByType(this.type)
        .then(response => {
          this.credentials = response.data;
          if (response.data.length > 0) this.columns = Object.keys(response.data[0]).filter(
            column => !['_id', 'alias'].includes(column));
          this.$nextTick(() => {
            this.credentials.forEach(credential => {
              if (this.data.credentials.includes(credential._id)) {
                this.$refs.credentialTable.toggleRowSelection(credential, true);
              }
            });
          });
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    onSelectionChange(selection) {
      this.data.credentials = selection.map(selected => selected._id);
    },
  }
};
</script>

<style scoped>
.table-loading {
  height: 48px;
}
</style>
