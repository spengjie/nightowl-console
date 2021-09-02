<template>
  <el-form
    ref="taskForm"
    :model="taskForm">
    <el-form-item prop="content">
      <code-editor v-model="taskForm.content" mode="yaml" style="line-height: normal" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="submitting" @click="onSubmit">
        {{ $t('ui.submit') }}
      </el-button>
      <el-button @click="onCancel">
        {{ $t('ui.cancel') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {
  addTask,
  fetchTask,
  updateTask,
} from '@/api/tasks';
import CodeEditor from '@/components/CodeEditor';

export default {
  name: 'TaskDetail',
  components: { CodeEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      taskForm: {
        content: '',
      },
      submitting: false,
    };
  },
  created() {
    this.fetchTask();
  },
  methods: {
    fetchTask() {
      if (!this.isEdit) return;
      const _id = this.$route.params && this.$route.params._id;
      fetchTask(_id)
        .then(response => {
          this.taskForm = response.data;
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.$router.replace('/404').catch(() => {});
          } else {
            this.$router.push({ name: 'taskList' });
          }
        });
    },
    onSubmit() {
      this.$refs.taskForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const submitFunc = this.isEdit ? updateTask : addTask;
          const _id = this.$route.params && this.$route.params._id;
          submitFunc(this.taskForm, _id)
            .then(() => {
              this.$message({
                message: this.$t('message.form.submitted'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              this.$router.push({ name: 'taskList' });
            })
            .catch(error => {
              if (error.response.status === 400) {
                this.$message({
                  message: this.$t('message.form.error', { error: error.response.data.error }),
                  type: 'error',
                  showClose: true,
                  duration: 0,
                });
              }
            })
            .finally(() => {
              this.submitting = false;
            });
        }
      });
    },
    onCancel() {
      this.$router.push({ name: 'taskList' });
    },
  }
};
</script>
