<template>
  <el-main>
    <task-detail is-edit />
  </el-main>
</template>

<script>
import TaskDetail from './components/TaskDetail';
export default {
  name: 'EditTask',
  components: { TaskDetail }
};
</script>
