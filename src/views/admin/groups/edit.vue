<template>
  <el-main>
    <group-detail is-edit />
  </el-main>
</template>

<script>
import GroupDetail from './components/GroupDetail';
export default {
  name: 'EditGroup',
  components: { GroupDetail }
};
</script>
