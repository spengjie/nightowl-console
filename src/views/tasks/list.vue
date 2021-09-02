<template>
  <el-main>
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="onAdd">
        {{ $t('ui.add') }}
      </el-button>
    </div>
    <extended-table :data="data" row-key="_id">
      <el-table-column prop="_id" label="ID" width="290" />
      <el-table-column prop="status" :label="$t('ui.status')" :width="200" />
      <el-table-column :label="$t('ui.nextRunTime')" :width="160">
        <template #default="{ row }">
          {{ formatDate(row.next_run_time) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.lastResult')" :min-width="200">
        <template #default="{ row }">
          <div
            v-if="row.last_result.ran_at"
            :class="getTaskResultColor(row.last_result)">
            <i :class="getTaskResultIcon(row.last_result)" />
            <span>{{ formatDate(row.last_result.ran_at) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.operations')" width="235px">
        <template #default="{ row, $index }">
          <el-button type="primary" plain size="mini" @click="onView(row)">
            {{ $t('ui.view') }}
          </el-button>
          <el-button type="primary" plain size="mini" @click="onEdit(row)">
            {{ $t('ui.edit') }}
          </el-button>
          <el-button type="danger" plain :loading="row._deleting" size="mini" @click="onDelete(row, $index)">
            {{ $t('ui.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </extended-table>
  </el-main>
</template>

<script>
import {
  deleteTask,
  fetchTaskList,
} from '@/api/tasks';
import { getTaskResultColor, getTaskResultIcon } from '@/utils/appearance';
import { formatDate } from '@/utils/datetime';
import ExtendedTable from '@/components/ExtendedTable';

export default {
  name: 'TaskList',
  components: { ExtendedTable },
  data() {
    return {
      data: []
    };
  },
  created() {
    this.fetchTaskList();
  },
  methods: {
    formatDate,
    getTaskResultColor,
    getTaskResultIcon,
    fetchTaskList() {
      fetchTaskList()
        .then(response => {
          this.data = response.data;
        })
        .catch(() => {})
        .finally(() => {});
    },
    onAdd() {
      this.$router.push({ name: 'addTask' }).catch(() => {});
    },
    onView(row) {
      this.$router.push({ name: 'viewTask', params: { _id: row._id } }).catch(() => {});
    },
    onEdit(row) {
      this.$router.push({ name: 'editTask', params: { _id: row._id } }).catch(() => {});
    },
    onDelete(row, $index) {
      this.$set(row, '_deleting', true);
      deleteTask(row._id)
        .then(() => {
          this.data.splice($index, 1);
        })
        .catch(() => {})
        .finally(() => {
          this.$set(row, '_deleting', false);
        });
    },
  }
};
</script>
