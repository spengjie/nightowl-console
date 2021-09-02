<template>
  <el-main>
    <div ref="toolbar" class="toolbar">
      <el-button
        v-permission="[`admin.${type}:write.add`]"
        type="primary"
        icon="el-icon-plus"
        @click="addItem">
        {{ $t('ui.add') }}
      </el-button>
      <el-button
        v-show="selected._id"
        v-permission="[`admin.${type}:write.edit`]"
        icon="el-icon-edit"
        @click="editItem">
        {{ $t('ui.edit') }}
      </el-button>
      <el-button
        v-show="selection.length > 0"
        v-permission="[`admin.${type}:write.delete`]"
        type="danger"
        plain
        icon="el-icon-delete"
        @click="deleteItems">
        {{ $t('ui.delete') }}
      </el-button>
      <el-button
        v-permission="['admin.groups:write.add', 'admin.groups:write.edit', 'admin.users:write.add', 'admin.users:write.edit']"
        type="primary"
        icon="el-icon-refresh"
        :loading="syncing"
        @click="startSyncing">
        {{ $t('ui.syncWithSso') }}
      </el-button>
      <el-button
        v-if="syncing"
        v-permission="['admin.groups:write.add', 'admin.groups:write.edit', 'admin.users:write.add', 'admin.users:write.edit']"
        type="danger"
        :loading="stopping"
        @click="stopSyncing">
        {{ $t('ui.stop') }}
      </el-button>
      <span
        v-if="lastUpdated"
        v-permission="['admin.groups:write.add', 'admin.groups:write.edit', 'admin.users:write.add', 'admin.users:write.edit']"
        style="margin-left: 10px; font-size: 14px; color: #909399">
        {{ $t('ui.lastUpdated') }}: {{ formatDate(lastUpdated) }}
      </span>
      <div class="right-bar">
        <el-switch
          v-if="type === 'users'"
          v-model="showDisabled"
          :active-text="$t('ui.showDisabledUser')"
          style="margin-right: 10px"
          @change="disabledUserVisiblilityChange" />
        <el-button icon="el-icon-refresh" class="is-square" :loading="refreshing" @click="refreshTable" />
      </div>
    </div>
    <extended-table
      ref="table"
      :data="data"
      :loading="refreshing"
      :limit="limit"
      :total="total"
      row-key="_id"
      :row-class-name="tableRowClassName"
      fixed-header
      :style="{ height: height }"
      selectable
      filterable
      :filter-storage-key="type"
      :filter-keys="filterKeys"
      :keyword-filter-keys="keywordFilterKeys"
      :fetch-value-suggestions="fetchFilterValueSuggestions"
      :remote-method="filterTable"
      @selection-change="selectionChange"
      @page-change="pageChange">
      <slot />
    </extended-table>
  </el-main>
</template>

<script>
import { getSyncTaskStatus, startSyncTask, stopSyncTask } from '@/api/sync';
import { bulkDeleteGroups, searchGroups, queryGroups } from '@/api/groups';
import { bulkDeleteUsers, searchUsers, queryUsers } from '@/api/users';
import { formatDate } from '@/utils/datetime';
import { checkPermission } from '@/utils/permission';
import { clone } from '@/utils/objectHelper';
import ExtendedTable from '@/components/ExtendedTable';

export default {
  name: 'ItemList',
  components: { ExtendedTable },
  props: {
    type: {
      type: String,
      validator(value) {
        return ['users', 'groups'].indexOf(value) !== -1;
      }
    },
    filterKeys: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      page: 0,
      limit: 50,
      total: 0,
      filters: [],
      data: [],
      syncing: false,
      starting: false,
      stopping: false,
      lastUpdated: '',
      updateInterval: 5,
      updateTimer: null,
      refreshing: false,
      selected: {},
      selection: [],
      showDisabled: false,
      height: undefined,
      typeMap: {
        users: {
          queryFunc: queryUsers,
          fetchListFunc: searchUsers,
          bulkDeleteFunc: bulkDeleteUsers,
          addRouteName: 'addUser',
          editRouteName: 'editUser',
        },
        groups: {
          queryFunc: queryGroups,
          fetchListFunc: searchGroups,
          bulkDeleteFunc: bulkDeleteGroups,
          addRouteName: 'addGroup',
          editRouteName: 'editGroup',
        },
      }
    };
  },
  computed: {
    keywordFilterKeys() {
      return this.type === 'users' ? ['username', 'name', 'english_name'] : ['name'];
    },
    queryFunc() {
      return this.typeMap[this.type].queryFunc;
    },
    fetchListFunc() {
      return this.typeMap[this.type].fetchListFunc;
    },
    bulkDeleteFunc() {
      return this.typeMap[this.type].bulkDeleteFunc;
    },
    addRouteName() {
      return this.typeMap[this.type].addRouteName;
    },
    editRouteName() {
      return this.typeMap[this.type].editRouteName;
    },
  },
  created() {
    if (checkPermission(['admin.groups:write.add', 'admin.groups:write.edit', 'admin.users:write.add', 'admin.users:write.edit'])) {
      this.getSyncTaskStatus();
    }
  },
  mounted() {
    const toolbarEl = this.$refs.toolbar;
    this.height = `calc(100% - ${toolbarEl.offsetHeight}px - ${getComputedStyle(toolbarEl).marginBottom})`;
  },
  beforeDestroy() {
    this.stopUpdateTimer();
  },
  methods: {
    formatDate,
    addItem() {
      this.$router.push({ name: this.addRouteName }).catch(() => {});
    },
    editItem() {
      this.$router.push({ name: this.editRouteName, params: { _id: this.selected._id } }).catch(() => {});
    },
    deleteItems() {
      this.$confirm(this.$tc('message.form.confirm', 2, {
          operation: this.$t('ui.delete'),
          type: this.$t('ui.' + this.type),
        }), this.$t('ui.confirm'), {
        type: 'warning'
      })
        .then(() => {
          const selected = this.$refs.table.selection.map(row => {
            return row._id;
          });
          this.bulkDeleteFunc(selected)
            .then(() => {
              this.$message({
                message: this.$t('message.form.deleted'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              this.refreshTable();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    startSyncing() {
      this.startUpdateTimer();
      this.starting = true;
      startSyncTask()
        .then(() => {
          this.$message({
            message: this.$t('message.form.started'),
            type: 'success',
            showClose: true,
            duration: 2 * 1000,
          });
          this.syncing = true;
        })
        .catch(() => {})
        .finally(() => {
          this.starting = false;
        });
    },
    stopSyncing() {
      this.stopUpdateTimer();
      this.stopping = true;
      stopSyncTask()
        .then(() => {
          this.$message({
            message: this.$t('message.form.stopped'),
            type: 'success',
            showClose: true,
            duration: 2 * 1000,
          });
          this.syncing = false;
        })
        .catch(() => {})
        .finally(() => {
          this.stopping = false;
        });
    },
    getSyncTaskStatus() {
      getSyncTaskStatus()
        .then(response => {
          const data = response.data;
          if (data.status === 'Running') {
            this.startUpdateTimer();
            this.syncing = true;
          }
          this.lastUpdated = data.last_updated_at;
        })
        .catch(() => {});
    },
    fetchSyncTaskResult() {
      getSyncTaskStatus()
        .then(response => {
          const data = response.data;
          if (data.status === 'Running') {
            return;
          }
          this.data = response.data[this.type];
          this.lastUpdated = data.last_updated_at;
          this.stopUpdateTimer();
          this.syncing = false;
          this.refreshTable();
        })
        .catch(() => {});
    },
    startUpdateTimer() {
      if (this.updateTimer === null) {
        this.updateTimer = setInterval(this.fetchSyncTaskResult, this.updateInterval * 1000);
      }
    },
    stopUpdateTimer() {
      if (this.updateTimer !== null) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }
    },
    fetchFilterValueSuggestions(key, value, cb) {
      const query = { key, q: value };
      if (!this.showDisabled) {
        query.extra_query = { disabled: false };
      }
      this.queryFunc(query)
        .then(response => {
          cb(response.data.filter(sugguestion => {
            return sugguestion;
          }));
        })
        .catch(() => {
          cb([]);
        });
    },
    fetchItems() {
      this.refreshing = true;
      const filters = clone(this.filters);
      if (this.type === 'users' && !this.showDisabled) {
        filters.push({ key: 'disabled', value: false, type: 'bool' });
      }
      this.fetchListFunc(this.page * this.limit, this.limit, filters, this.keywordFilterKeys)
        .then(response => {
          this.data = response.data[this.type];
          this.total = response.data.total;
        })
        .catch(() => {})
        .finally(() => {
          this.refreshing = false;
        });
    },
    refreshTable() {
      this.fetchItems();
    },
    selectionChange(selection) {
      this.selected = selection.length === 1 ? selection[0] : {};
      this.selection = selection;
    },
    pageChange(page) {
      this.page = page;
      this.refreshTable();
    },
    filterTable(filters) {
      this.page = 0;
      this.filters = filters;
      this.refreshTable();
    },
    disabledUserVisiblilityChange() {
      this.refreshTable();
    },
    tableRowClassName({ row }) {
      if (this.type === 'users' && this.showDisabled && row.disabled) {
        return 'disabled-user';
      }
      return '';
    }
  }
};
</script>

<style>
.el-table .disabled-user {
  background: #FAFAFB;
  text-decoration: line-through;
}
.toolbar .el-switch__label {
  font-size: 14px;
  color: #909399;
}
</style>
