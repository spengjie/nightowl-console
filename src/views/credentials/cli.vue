<template>
  <div>
    <el-dialog
      :title="$t('ui.cliCredentials')"
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
        <el-form-item :label="$t('ui.username')" prop="username" required>
          <el-input v-model="credentialsForm.username" />
        </el-form-item>
        <el-form-item :label="$t('ui.type')" prop="type" required>
          <el-select v-model="credentialsForm.type">
            <el-option :label="$t('ui.password')" value="password" />
            <el-option :label="$t('ui.privateKey')" value="private_key" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="credentialsForm.type === 'password'" key="password" :label="$t('ui.password')" prop="password" required>
          <el-input v-model="credentialsForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item v-if="credentialsForm.type === 'private_key'" key="private_key" :label="$t('ui.privateKey')" prop="private_key" required>
          <el-input v-model="credentialsForm.private_key" type="textarea" :rows="10" />
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
      <el-table-column prop="username" :label="$t('ui.username')" />
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
  addCliCredential,
  deleteCliCredential,
  fetchCliCredential,
  fetchCliCredentials,
  updateCliCredential,
} from '@/api/credentials';

export default {
  name: 'CliCredentials',
  data() {
    return {
      data: [],
      loadingDetail: false,
      id: null,
      dialogVisible: false,
      credentialsForm: {
        alias: null,
        username: null,
        type: 'password',
        password: null,
        private_key: null,
      },
      submitting: false,
    };
  },
  watch: {
    dialogVisible(value) {
      if (value && this.id) this.fetchCliCredential();
    }
  },
  created() {
    this.fetchCliCredentials();
  },
  methods: {
    fetchCliCredentials() {
      fetchCliCredentials()
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
    fetchCliCredential() {
      this.loadingDetail = true;
      fetchCliCredential(this.id)
        .then(response => {
          const data = response.data;
          data.type = data.private_key ? 'private_key' : 'password';
          this.credentialsForm = data;
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
          const submitFunc = this.id ? updateCliCredential : addCliCredential;
          const data = {
            alias: this.credentialsForm.alias,
            username: this.credentialsForm.username,
          };
          const psw = this.credentialsForm[this.credentialsForm.type];
          if (psw !== '$encrypted') {
            data[this.credentialsForm.type] = psw;
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
              this.fetchCliCredentials();
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
        deleteCliCredential(row._id)
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
