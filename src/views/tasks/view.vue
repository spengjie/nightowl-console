<template>
  <el-main>
    <div class="toolbar">
      <el-select v-model="currentId" style="margin-left: 6px">
        <el-option
          v-for="result in results"
          :key="result._id"
          :label="formatDate(result.ran_at)"
          :value="result._id">
          <div :class="getTaskResultColor(result)">
            <i :class="getTaskResultIcon(result)" />
            <span>{{ formatDate(result.ran_at) }}</span>
          </div>
        </el-option>
      </el-select>
      <div class="right-bar">
        <el-button icon="el-icon-refresh" :loading="loading" class="is-square" @click="onRefresh" />
      </div>
    </div>
    <el-table :data="currentResult.discovered" border :row-class-name="logRowClassName" height="calc(50% - 25px)">
      <el-table-column :label="$t('ui.time')" :width="160">
        <template #default="{ row }">
          {{ formatDate(row.time) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.name')">
        <template #default="{ row }">
          <el-tooltip :content="row.type">
            <icon :icon-class="row.icon" />
          </el-tooltip>
          <span style="margin-left: 6px">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discovered_from" :label="$t('ui.discoveredFrom')" sortable />
    </el-table>
    <el-table :data="currentResult.logs" border :row-class-name="logRowClassName" height="calc(50% - 25px)" style="margin-top: 6px">
      <el-table-column :label="$t('ui.time')" :width="160">
        <template #default="{ row }">
          {{ formatDate(row.time) }}
        </template>
      </el-table-column>
      <el-table-column prop="message" :label="$t('ui.message')" />
      <el-table-column :label="$t('ui.level')" :width="100">
        <template #default="{ row }">
          {{ translateLogLevel(row.level) }}
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import {
  fetchTaskResult,
  fetchTaskResults,
} from '@/api/tasks';
import { getTaskResultColor, getTaskResultIcon } from '@/utils/appearance';
import { formatDate } from '@/utils/datetime';
import { translateLogLevel } from '@/utils/i18n';

export default {
  name: 'ViewTask',
  data() {
    return {
      loading: false,
      results: [],
      currentId: null,
      currentResult: {},
    };
  },
  watch: {
    currentId() {
      this.fetchTaskResult();
    }
  },
  created() {
    this.fetchTaskResults();
  },
  methods: {
    formatDate,
    getTaskResultColor,
    getTaskResultIcon,
    translateLogLevel,
    fetchTaskResults() {
      const _id = this.$route.params && this.$route.params._id;
      fetchTaskResults(_id)
        .then(response => {
          this.results = response.data;
          if (this.results.length > 0) this.currentId = this.results[0]._id;
        })
        .catch(() => {});
    },
    fetchTaskResult() {
      const _id = this.$route.params && this.$route.params._id;
      if (!_id) return;
      this.loading = true;
      fetchTaskResult(_id, this.currentId)
        .then(response => {
          this.currentResult = response.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    onRefresh() {
      this.fetchTaskResult();
    },
    logRowClassName({ row }) {
      if (row.level >= 3) return 'text-danger';
      if (row.level === 2) return 'text-warning';
      return '';
    },
  }
};
</script>
