<template>
  <el-main>
    <user-detail is-edit />
  </el-main>
</template>

<script>
import UserDetail from './components/UserDetail';
export default {
  name: 'EditUser',
  components: { UserDetail }
};
</script>
