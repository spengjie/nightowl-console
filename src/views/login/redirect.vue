<template>
  <div v-loading.fullscreen.lock="loading" />
</template>

<script>
export default {
  name: 'Redirect',
  data() {
    return {
      redirect: undefined,
      loading: false,
    };
  },
  created() {
    this.loading = true;
    const query = this.$route.query;
    if (query) {
      this.redirect = query.redirect;
    }
    if (query.state !== this.$store.state.user.oauthState) {
      this.$message({
        message: 'Incorrect state, CSRF might occur',
        type: 'error',
        showClose: true,
        duration: 0,
      });
      this.loading = false;
      return;
    }
    const authError = query.error;
    if (authError) {
      if (authError === 'access_denied') {
        this.$router.replace('/401').catch(() => {});
      } else {
        this.$router.replace('/500').catch(() => {});
      }
      this.loading = false;
      return;
    }
    const redirectUri = '/login/redirect';
    const authCode = query.code;
    this.$store.dispatch('user/authorize', { authCode, redirectUri })
      .then(() => {
        this.$message({
          message: this.$t('message.form.loggedIn'),
          type: 'success',
          duration: 1 * 1000,
        });
        this.$router.push({ path: this.redirect || '/' }).catch(() => {});
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.$router.replace('/401').catch(() => {});
        } else {
          this.$router.replace('/500').catch(() => {});
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
};
</script>
