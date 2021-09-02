<template>
  <router-link :to="to" @click.native="appCenter.visible = false">
    <li class="app-center-menu-item">
      <icon v-if="icon" :icon-class="icon" /><span class="app-center-menu-item__label" :class="{ 'has-icon': !!icon }">{{ label }}</span>
    </li>
  </router-link>
</template>

<script>
export default {
  name: 'AppMenuItem',
  inject: ['appCenter'],
  props: {
    to: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  }
};
</script>
