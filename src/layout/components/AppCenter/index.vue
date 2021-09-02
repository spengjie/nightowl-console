<template>
  <el-popover
    ref="popper"
    v-model="visible"
    v-clickoutside="handleClickOutside"
    trigger="manual"
    :visible-arrow="false"
    popper-class="app-center">
    <app-menu>
      <app-menu-item to="/dashboard" :label="$t('ui.dashboard')" icon="dashboard" />
      <app-menu-item to="/map" label="Map" icon="map" />
      <app-menu-item to="/network" :label="$t('ui.network')" icon="network" />
      <app-menu-item to="/credentials" :label="$t('ui.credentials')" icon="el-icon-key" />
      <app-menu-item to="/tasks" :label="$t('ui.tasks')" icon="el-icon-files" />
      <app-menu-item to="/admin" :label="$t('ui.administration')" icon="admin" />
    </app-menu>
    <i slot="reference" class="el-icon-menu navbar-icon navbar-item__inner" @click="visible = !visible" />
  </el-popover>
</template>

<script>
import AppMenu from './AppMenu';
import AppMenuItem from './AppMenuItem';

export default {
  name: 'AppCenter',
  components: {
    AppMenu,
    AppMenuItem,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      appCenter: this,
    };
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.popperElm = this.$refs.popper.$refs.popper;
  },
  methods: {
    handleClickOutside() {
      this.visible = false;
    },
  }
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
