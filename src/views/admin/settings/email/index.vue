<template>
  <el-form
    ref="emailSettings"
    :model="emailSettings"
    :show-message="editable"
    label-width="auto">
    <el-form-item :label="$t('ui.smtpServer')" prop="host" :required="editable">
      <el-input v-model="emailSettings.host" :disabled="!editable" />
    </el-form-item>
    <el-form-item :label="$t('ui.port')" prop="port" :required="editable">
      <el-input v-model="emailSettings.port" :disabled="!editable" />
    </el-form-item>
    <el-form-item :label="$t('ui.authenType')" prop="auth_type" :required="editable">
      <el-select v-model="emailSettings.auth_type" :disabled="!editable">
        <el-option value="None" />
        <el-option value="SSL" />
        <el-option value="TLS" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('ui.emailAddress')" prop="email" :required="editable" :rules="[{ type: 'email' }]">
      <el-input v-model="emailSettings.email" :disabled="!editable" />
    </el-form-item>
    <el-form-item :label="$t('ui.password')" prop="password" :required="editable">
      <el-input v-model="emailSettings.password" type="password" show-password :disabled="!editable" />
    </el-form-item>
    <el-form-item>
      <el-button v-permission="['admin.settings.email:write']" @click="onTest">
        {{ $t('ui.test') }}
      </el-button>
      <el-button v-if="!editable" v-permission="['admin.settings.email:write']" @click="onEdit">
        {{ $t('ui.edit') }}
      </el-button>
      <el-button v-if="editable" type="primary" :loading="saving" @click="onSubmit">
        {{ $t('ui.save') }}
      </el-button>
      <el-button v-if="editable" @click="onCancel">
        {{ $t('ui.cancel') }}
      </el-button>
    </el-form-item>
    <el-dialog
      :visible.sync="testDialogVisible"
      custom-class="noheader-dialog"
      width="360px">
      <el-form ref="testSettings" :model="testSettings" inline>
        <el-form-item prop="to_addr" required>
          <el-input v-model="testSettings.to_addr" :placeholder="$t('ui.mailTo')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="testing" @click="testEmailSettings">
            {{ $t('ui.test') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-form>
</template>

<script>
import { fetchEmailSettings, testEmailSettings, updateEmailSettings } from '@/api/email';

export default {
  name: 'EmailSettings',
  data() {
    return {
      editable: false,
      saving: false,
      testDialogVisible: false,
      testing: false,
      testSettings: {
        to_addr: '',
      },
      emailSettings: {
        host: '',
        port: '',
        auth_type: 'None',
        email: '',
        password: '',
      }
    };
  },
  created() {
    this.fetchEmailSettings();
  },
  methods: {
    fetchEmailSettings() {
      fetchEmailSettings()
        .then(response => {
          const data = response.data;
          this.emailSettings.host = data.host;
          this.emailSettings.port = data.port;
          this.emailSettings.auth_type = data.auth_type;
          this.emailSettings.email = data.email;
          this.emailSettings.password = data.password;
        })
        .catch(() => {});
    },
    onTest() {
      this.testDialogVisible = true;
    },
    testEmailSettings() {
      this.$refs.testSettings.validate(valid => {
        if (valid) {
          this.testing = true;
          const emailSettings = this.editable ? { ...this.emailSettings } : {};
          if (emailSettings.password === '$encrypted') delete emailSettings.password;
          testEmailSettings(this.testSettings.to_addr, emailSettings)
            .then(response => {
              const data = response.data;
              if (data) {
                this.$message({
                  message: this.$t('message.form.testFailed', { error: data.error }),
                  type: 'error',
                  showClose: true,
                  duration: 5 * 1000,
                });
              } else {
                this.$message({
                  message: this.$t('message.form.tested'),
                  type: 'success',
                  showClose: true,
                  duration: 2 * 1000,
                });
                this.testDialogVisible = false;
              }
            })
            .catch(() => {})
            .finally(() => {
              this.testing = false;
            });
        }
      });
    },
    onEdit() {
      this.editable = true;
    },
    onSubmit() {
      this.$refs.emailSettings.validate(valid => {
        if (valid) {
          this.saving = true;
          const emailSettings = { ...this.emailSettings };
          if (emailSettings.password === '$encrypted') delete emailSettings.password;
          updateEmailSettings(emailSettings)
            .then(response => {
              this.$message({
                message: this.$t('message.form.saved'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              const data = response.data;
              this.emailSettings.host = data.host;
              this.emailSettings.port = data.port;
              this.emailSettings.auth_type = data.auth_type;
              this.emailSettings.email = data.email;
              this.emailSettings.password = data.password;
              this.editable = false;
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
              this.saving = false;
            });
        }
      });
    },
    onCancel() {
      this.editable = false;
      this.fetchEmailSettings();
    },
  }
};
</script>
