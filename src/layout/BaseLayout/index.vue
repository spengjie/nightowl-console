<template>
  <el-container>
    <navbar />
    <router-view class="main-layout" />
  </el-container>
</template>

<script>
import Navbar from '../components/Navbar';

export default {
  name: 'BaseLayout',
  components: {
    Navbar,
  },
};
</script>
