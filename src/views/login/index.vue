<template>
  <div v-if="showLoginForm" class="wrapper-center login-page">
    <div class="login-wrap">
      <el-form ref="loginForm" :model="loginForm" size="default">
        <el-form-item>
          <div class="wrapper-center">
            <img src="@/assets/nightowl.png" class="login-logo">
          </div>
        </el-form-item>
        <el-form-item>
          <div class="system-name">
            NightOwl
          </div>
        </el-form-item>
        <el-alert
          v-show="message.length > 0"
          :title="message"
          type="error"
          show-icon
          :closable="false" />
        <el-form-item v-if="loginType.includes('sso')">
          <el-button style="width: 100%" @click="loginWithSso">
            {{ $t('ui.loginWithSso') }}
          </el-button>
        </el-form-item>
        <el-divider v-if="loginType.includes('sso')" type="primary" style="width: 100%">
          {{ $t('ui.or') }}
        </el-divider>
        <el-form-item prop="username" required>
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            :placeholder="$t('ui.email') + ' / ' + $t('ui.username')" />
        </el-form-item>
        <el-form-item prop="password" required>
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
            :placeholder="$t('ui.password')"
            @keydown.enter.native="login" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loggingIn" style="width: 100%" @click="login">
            {{ $t('ui.login') }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="system-statement">
        NightOwl Network Development Platform
      </div>
    </div>
  </div>
  <div v-else v-loading.fullscreen.lock="loading" />
</template>

<script>
import { fetchAuthSso } from '@/api/auth';
import { generateUrl } from '@/utils/path';

export default {
  name: 'Login',
  data() {
    return {
      message: '',
      loginType: [],
      loginForm: {
        username: '',
        password: '',
      },
      redirect: undefined,
      ssoInfo: {},
      loading: false,
      loggingIn: false,
    };
  },
  computed: {
    showLoginForm() {
      return !(this.loginType.length === 0 || (this.loginType.length === 1 && this.loginType[0] === 'sso'));
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
        }
      },
      immediate: true,
    }
  },
  created() {
    const query = this.redirect ? { redirect: this.redirect } : {};
    const redirect = generateUrl('/login/redirect', query);
    this.loading = true;
    fetchAuthSso(redirect)
      .then(response => {
        this.loginType = Object.keys(response.data);
        const data = response.data;
        if (data.sso !== undefined) {
          this.ssoInfo = data.sso;
          if (data.local === undefined) {
            this.loginWithSso();
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    loginWithSso() {
      location.href = this.ssoInfo.url;
      this.$store.dispatch('user/setOauthState', this.ssoInfo.state);
    },
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.message = '';
          this.loggingIn = true;
          this.loginForm.auth_source = 'Local';
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$message({
                message: this.$t('message.form.loggedIn'),
                type: 'success',
                showClose: true,
                duration: 1 * 1000,
              });
              this.$router.push({ path: this.redirect || '/' }).catch(() => {});
            })
            .catch(error => {
              this.message = error.message;
            })
            .finally(() => {
              this.loggingIn = false;
            });
        }
      });
    }
  }
};
</script>
