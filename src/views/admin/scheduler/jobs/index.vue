<template>
  <el-main>
    <extended-table
      ref="table"
      :data="data"
      :loading="loading"
      row-key="_id"
      fixed-header
      :show-overflow-tooltip="false"
      :style="{ height: '100%' }">
      <el-table-column prop="_id" label="ID" width="290" />
      <el-table-column prop="name" :label="$t('ui.name')" width="200" />
      <el-table-column prop="next_run_time" :label="$t('ui.nextRunTime')" width="180">
        <template #default="{ row }">
          <i class="el-icon-time" />
          <span style="margin-left: 6px">{{ formatDate(row.next_run_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="trigger.type" :label="$t('ui.type')" width="80" />
      <el-table-column :label="$t('ui.trigger')" width="160">
        <template #default="{ row }">
          <template v-if="row.trigger.type === 'cron'">
            <el-tooltip>
              <template #content>
                <div>
                  {{ `year: ${row.trigger.year}` }}
                </div>
                <div>
                  {{ `month: ${row.trigger.month}` }}
                </div>
                <div>
                  {{ `day: ${row.trigger.day}` }}
                </div>
                <div>
                  {{ `week: ${row.trigger.week}` }}
                </div>
                <div>
                  {{ `day_of_week: ${row.trigger.day_of_week}` }}
                </div>
                <div>
                  {{ `hour: ${row.trigger.hour}` }}
                </div>
                <div>
                  {{ `minute: ${row.trigger.minute}` }}
                </div>
                <div>
                  {{ `second: ${row.trigger.second}` }}
                </div>
              </template>
              <span>
                {{ row.trigger.year }}
                {{ row.trigger.month }}
                {{ row.trigger.day }}
                {{ row.trigger.week }}
                {{ row.trigger.day_of_week }}
                {{ row.trigger.hour }}
                {{ row.trigger.minute }}
                {{ row.trigger.second }}
              </span>
            </el-tooltip>
          </template>
          <template v-else-if="row.trigger.type === 'date'">
            {{ formatDate(row.trigger.run_date) }}
          </template>
          <template v-else-if="row.trigger.type === 'interval'">
            {{ row.trigger.interval }} {{ $t('ui.seconds') }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="func" :label="$t('ui.function')" width="350" />
      <el-table-column :label="$t('ui.args')" min-width="180">
        <template #default="{ row }">
          <el-tag v-for="arg in row.args" :key="arg">
            {{ arg }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ui.kwargs')" min-width="180">
        <template #default="{ row }">
          <el-tag v-for="(arg, key) in row.kwargs" :key="key">
            {{ `${key}: ${arg}` }}
          </el-tag>
        </template>
      </el-table-column>
    </extended-table>
  </el-main>
</template>

<script>
import { fetchSchedulerJobs } from '@/api/scheduler';
import { formatDate } from '@/utils/datetime';
import ExtendedTable from '@/components/ExtendedTable';

export default {
  name: 'JobList',
  components: { ExtendedTable },
  data() {
    return {
      data: [],
      loading: false,
    };
  },
  created() {
    this.fetchSchedulerJobs();
  },
  methods: {
    formatDate,
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
    fetchSchedulerJobs() {
      this.loading = true;
      fetchSchedulerJobs()
        .then(response => {
          this.data = response.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
  }
};
</script>
