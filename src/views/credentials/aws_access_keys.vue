<template>
  <div>
    <el-dialog
      title="AWS Access Key"
      :visible.sync="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="520px">
      <div v-if="loadingDetail" v-loading="loadingDetail" style="height: 250px" />
      <el-form
        v-show="!loadingDetail"
        ref="credentialsForm"
        :model="credentialsForm"
        label-width="100px">
        <el-form-item :label="$t('ui.alias')" prop="alias" required>
          <el-input v-model="credentialsForm.alias" />
        </el-form-item>
        <el-form-item :label="$t('ui.regionName')" prop="region_name" required>
          <el-input v-model="credentialsForm.region_name" />
        </el-form-item>
        <el-form-item label="Access Key" prop="access_key" required>
          <el-input v-model="credentialsForm.access_key" />
        </el-form-item>
        <el-form-item label="Secret Key" prop="secret_key" required>
          <el-input v-model="credentialsForm.secret_key" type="password" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="onSubmit">
            {{ $t('ui.submit') }}
          </el-button>
          <el-button @click="dialogVisible = false">
            {{ $t('ui.cancel') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="toolbar">
      <el-button type="primary" icon="el-icon-plus" @click="showDialog(null)">
        {{ $t('ui.add') }}
      </el-button>
    </div>
    <el-table :data="data" border>
      <el-table-column prop="alias" :label="$t('ui.alias')" />
      <el-table-column prop="region_name" :label="$t('ui.region')" />
      <el-table-column prop="access_key" label="Access Key" />
      <el-table-column :label="$t('ui.operations')" width="170px">
        <template #default="{ row, $index }">
          <el-button type="primary" plain size="mini" @click="showDialog(row._id)">
            {{ $t('ui.edit') }}
          </el-button>
          <el-button type="danger" plain :loading="row._deleting" size="mini" @click="onDelete(row, $index)">
            {{ $t('ui.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  addAwsAccessKey,
  deleteAwsAccessKey,
  fetchAwsAccessKey,
  fetchAwsAccessKeys,
  updateAwsAccessKey,
} from '@/api/credentials';

export default {
  name: 'AwsAccessKeys',
  data() {
    return {
      data: [],
      loadingDetail: false,
      id: null,
      dialogVisible: false,
      credentialsForm: {
        alias: null,
        region_name: null,
        access_key: null,
        secret_key: null,
      },
      submitting: false,
    };
  },
  watch: {
    dialogVisible(value) {
      if (value && this.id) this.fetchAwsAccessKey();
    }
  },
  created() {
    this.fetchAwsAccessKeys();
  },
  methods: {
    fetchAwsAccessKeys() {
      fetchAwsAccessKeys()
        .then(response => {
          this.data = response.data;
        })
        .catch(() => {});
    },
    showDialog(id) {
      if(this.$refs.credentialsForm) this.$refs.credentialsForm.resetFields();
      this.id = id;
      this.dialogVisible = true;
    },
    fetchAwsAccessKey() {
      this.loadingDetail = true;
      fetchAwsAccessKey(this.id)
        .then(response => {
          this.credentialsForm = response.data;
        })
        .catch(() => {})
        .finally(() => {
          this.loadingDetail = false;
        });
    },
    onSubmit() {
      this.$refs.credentialsForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const submitFunc = this.id ? updateAwsAccessKey : addAwsAccessKey;
          const data = {
            ...this.credentialsForm,
          };
          if (submitFunc === updateAwsAccessKey && data.secret_key === '$encrypted') {
              delete data.secret_key;
          }
          submitFunc(data, this.id)
            .then(() => {
              this.$message({
                message: this.$t('message.form.submitted'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              this.dialogVisible = false;
              this.fetchAwsAccessKeys();
            })
            .catch(error => {
              if (error.response.status === 400) {
                this.$message({
                  message: this.$t('message.form.error', { error: error.response.data.error }),
                  type: 'error',
                  showClose: true,
                  duration: 0,
                });
              }
            })
            .finally(() => {
              this.submitting = false;
            });
        }
      });
    },
    onDelete(row, $index) {
      this.$confirm(this.$tc('message.form.confirm', 1, {
          operation: this.$t('ui.delete'),
          type: this.$t('ui.' + this.type),
        }), this.$t('ui.confirm'), {
        type: 'warning'
      }).then(() => {
        this.$set(row, '_deleting', true);
        deleteAwsAccessKey(row._id)
          .then(() => {
            this.data.splice($index, 1);
          })
          .catch(() => {})
          .finally(() => {
            this.$set(row, '_deleting', false);
          });
      })
      .catch(() => {});
    }
  }
};
</script>
