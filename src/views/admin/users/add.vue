<template>
  <el-main>
    <user-detail />
  </el-main>
</template>

<script>
import UserDetail from './components/UserDetail';
export default {
  name: 'AddUser',
  components: { UserDetail }
};
</script>
