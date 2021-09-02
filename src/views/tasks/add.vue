<template>
  <el-main>
    <task-detail />
  </el-main>
</template>

<script>
import TaskDetail from './components/TaskDetail';
export default {
  name: 'AddTask',
  components: { TaskDetail }
};
</script>
