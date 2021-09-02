<template>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="changeRoute">
      <el-tab-pane
        v-for="route in credentialsRoutes"
        :key="route.name"
        :label="translateTitle(route.meta.title)"
        :name="route.name" />
      <router-view />
    </el-tabs>
  </el-main>
</template>

<script>
import { mapGetters } from 'vuex';
import { searchRoute } from '@/utils/path';
import { translateTitle } from '@/utils/i18n';

export default {
  name: 'Credentials',
  data() {
    return {
      activeName: this.$route.name,
    };
  },
  computed: {
    ...mapGetters([
      'visibleRoutes',
    ]),
    credentialsRoutes() {
      const credentialsRoute = searchRoute(this.visibleRoutes, 'credentials');
      if (credentialsRoute) return credentialsRoute.children;
      return [];
    }
  },
  methods: {
    translateTitle,
    changeRoute(tab) {
      this.$router.push({ name: tab.name }).catch(() => {});
    }
  }
};
</script>
