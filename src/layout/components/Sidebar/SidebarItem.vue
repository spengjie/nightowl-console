<template>
  <router-link :to="item">
    <el-menu-item :index="index">
      <icon :icon-class="item.meta.icon" />
      <template #title>
        {{ translateTitle(item.meta.title) }}
        <el-badge v-if="badge && badgeNumber > 0" :value="badgeNumber" />
      </template>
    </el-menu-item>
  </router-link>
</template>

<script>
import { translateTitle } from '@/utils/i18n';
import FixiOSBug from './FixiOSBug';

export default {
  name: 'SidebarItem',
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true,
    },
    badge: {
      type: Boolean,
      default: false,
    },
    badgeNumber: Number,
  },
  computed: {
    index() {
      const route = this.$router.resolve(this.item).route;
      return route.redirectedFrom || route.path;
    }
  },
  methods: {
    translateTitle,
  }
};
</script>
