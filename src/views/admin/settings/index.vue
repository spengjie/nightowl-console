<template>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="changeRoute">
      <el-tab-pane
        v-for="route in settingsRoutes"
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
  name: 'Settings',
  data() {
    return {
      activeName: this.$route.name,
    };
  },
  computed: {
    ...mapGetters([
      'visibleRoutes',
    ]),
    settingsRoutes() {
      const settingsRoute = searchRoute(this.visibleRoutes, 'systemSettings');
      if (settingsRoute) return settingsRoute.children;
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
