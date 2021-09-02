<template>
  <el-header
    v-loading.fullscreen.lock="loading"
    height="50px"
    class="app-header">
    <router-link to="/" class="navbar-item">
      <div class="navbar-item__inner app-logo">
        <img src="@/assets/nightowl-white.png">
      </div>
    </router-link>
    <app-center class="navbar-item" />
    <breadcrumb />
    <div class="right-menu">
      <el-popover trigger="click" class="navbar-item">
        <el-tabs>
          <el-tab-pane label="Alerts" name="alert" />
          <el-tab-pane label="Notifications" name="notifications" />
        </el-tabs>
        <div slot="reference" class="navbar-item__inner message-badge-wrapper">
          <i class="navbar-icon el-icon-bell" />
          <sup class="message-badge" />
        </div>
      </el-popover>
      <el-dropdown trigger="click" class="navbar-item" @command="setLanguage">
        <div class="navbar-item__inner">
          {{ language === 'en' ? 'English' : '中文' }}<i class="el-icon-caret-bottom el-icon--right" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :disabled="language==='en'" command="en">
              English
            </el-dropdown-item>
            <el-dropdown-item :disabled="language==='zh'" command="zh">
              中文
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown trigger="click" class="navbar-item">
        <div class="navbar-item__inner">
          {{ name }}
          <i class="el-icon-caret-bottom el-icon--right" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <slot name="dropdown" />
            <el-dropdown-item @click.native="logout">
              <span>{{ $t('ui.logout') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AppCenter from '../AppCenter';
import Breadcrumb from '../Breadcrumb';

export default {
  name: 'Navbar',
  components: {
    AppCenter,
    Breadcrumb,
  },
  props: {
    hamburger: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapGetters([
      'name',
      'language',
    ]),
  },
  methods: {
    ...mapActions({
      setLanguage: 'app/setLanguage',
    }),
    async logout() {
      this.loading = true;
      await this.$store.dispatch('user/logout');
      this.loading = false;
      this.$router.push({ path: '/login', query: {redirect: this.$route.fullPath } }).catch(() => {});
    },
  }
};
</script>
