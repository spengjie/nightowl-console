<template>
  <el-container>
    <navbar />
    <el-container class="main-layout">
      <el-aside width="auto" class="sidebar-layout">
        <el-scrollbar class="scroll-x-hidden" style="height: calc(100% - 50px)">
          <el-menu :default-active="sidebarDefaultActive" class="el-menu-vertical" :collapse="!sidebar.opened">
            <sidebar-item v-for="route in childRoutes" :key="route.name" :item="route" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <router-view />
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPathByLevel } from '@/utils/path';
import Navbar from '../components/Navbar';
import SidebarItem from '../components/Sidebar/SidebarItem';

export default {
  name: 'SidebarLayout',
  components: {
    Navbar,
    SidebarItem,
  },
  data() {
    return {
      routes: [],
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'visibleRoutes',
    ]),
    sidebarDefaultActive() {
      const routePath = this.$route.path;
      return getPathByLevel(routePath, 2);
    },
    childRoutes() {
      const level1Path = getPathByLevel(this.$route.path, 1);
      for (const route of this.visibleRoutes) {
        if (route.path === level1Path) {
          return route.children;
        }
      }
      return [];
    },
  }
};
</script>
