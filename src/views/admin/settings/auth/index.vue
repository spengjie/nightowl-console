<template>
  <el-form
    ref="authSettings"
    :model="authSettings"
    :show-message="editable"
    :hide-required-asterisk="!editable"
    label-width="auto">
    <el-form-item :label="$t('ui.authenType')" prop="type" :required="editable">
      <el-radio-group v-model="authSettings.type" :disabled="!editable">
        <el-radio-button label="local">
          Local
        </el-radio-button>
        <el-radio-button label="sso">
          SSO
        </el-radio-button>
        <el-radio-button label="both">
          Both
        </el-radio-button>
      </el-radio-group>
    </el-form-item>
    <template v-if="authSettings.type !== 'local'">
      <el-form-item label="Client ID" prop="sso.client_id" required>
        <el-input v-model="authSettings.sso.client_id" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Client Secret" prop="sso.client_secret" required>
        <el-input v-model="authSettings.sso.client_secret" type="password" show-password :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Verify Certificate" prop="sso.verify_certificate" required>
        <el-switch v-model="authSettings.sso.verify_certificate" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Authorization URL" prop="sso.auth_url" required>
        <el-input v-model="authSettings.sso.auth_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Token URL" prop="sso.token_url" required>
        <el-input v-model="authSettings.sso.token_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="User API URL" prop="sso.user_api_url" required>
        <el-input v-model="authSettings.sso.user_api_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Session API URL" prop="sso.session_api_url" required>
        <el-input v-model="authSettings.sso.session_api_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Logout API URL" prop="sso.logout_api_url" required>
        <el-input v-model="authSettings.sso.logout_api_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Users API URL" prop="sso.users_api_url">
        <el-input v-model="authSettings.sso.users_api_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Groups API URL" prop="sso.groups_api_url">
        <el-input v-model="authSettings.sso.groups_api_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item label="Organization API URL" prop="sso.organization_api_url">
        <el-input v-model="authSettings.sso.organization_api_url" :disabled="!editable" />
      </el-form-item>
      <el-form-item
        :label="$t('ui.username')"
        prop="sso.username"
        :required="requireAuth">
        <el-input v-model="authSettings.sso.username" :disabled="!editable" />
      </el-form-item>
      <el-form-item
        :label="$t('ui.password')"
        prop="sso.password"
        :required="requireAuth">
        <el-input v-model="authSettings.sso.password" type="password" show-password :disabled="!editable" />
      </el-form-item>
    </template>
    <el-form-item>
      <el-button v-if="!editable" v-permission="['admin.settings.auth:write']" @click="onEdit">
        {{ $t('ui.edit') }}
      </el-button>
      <el-button v-if="editable" type="primary" :loading="saving" @click="onSubmit">
        {{ $t('ui.save') }}
      </el-button>
      <el-button v-if="editable" @click="onCancel">
        {{ $t('ui.cancel') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { fetchAuthSettings, updateAuthSettings } from '@/api/auth';

export default {
  name: 'AuthSettings',
  data() {
    return {
      editable: false,
      saving: false,
      authSettings: {
        type: 'local',
        sso: {
          verify_certificate: false,
        },
      },
    };
  },
  computed: {
    requireAuth() {
      return Boolean(this.authSettings.sso.users_api_url) ||
        Boolean(this.authSettings.sso.groups_api_url) ||
        Boolean(this.authSettings.sso.organization_api_url);
    }
  },
  created() {
    this.fetchAuthSettings();
  },
  methods: {
    fetchAuthSettings() {
      fetchAuthSettings()
        .then(response => {
          const data = response.data;
          this.authSettings.type = data.type;
          this.authSettings.sso = data.sso || {};
        })
        .catch(() => {});
    },
    onEdit() {
      this.editable = true;
    },
    onSubmit() {
      this.$refs.authSettings.validate(valid => {
        if (valid) {
          this.saving = true;
          const authSettings = { ...this.authSettings };
          if (authSettings.sso && authSettings.sso.password === '$encrypted')  delete authSettings.sso.password;
          updateAuthSettings(authSettings)
            .then(response => {
              this.$message({
                message: this.$t('message.form.saved'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              this.authSettings.type = response.data.type;
              this.authSettings.sso = response.data.sso || {};
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
      this.fetchAuthSettings();
    },
  }
};
</script>
