<template>
  <el-form
    ref="userForm"
    :model="userForm"
    label-width="auto">
    <el-form-item :label="$t('ui.username')" prop="username" required>
      <el-input v-model="userForm.username" />
    </el-form-item>
    <el-form-item :label="$t('ui.name')" prop="name" required>
      <el-input v-model="userForm.name" :disabled="userForm.type !== 'Local'" />
    </el-form-item>
    <template v-if="userForm.type === 'Local'">
      <password-form-item :label="$t('ui.password')" prop="password" required :allow-default="isEdit">
        <el-input v-model="userForm.password" show-password />
      </password-form-item>
      <el-form-item :label="$t('ui.email')" prop="email" required :rules="[{ type: 'email' }]">
        <el-input v-model="userForm.email" :disabled="userForm.type !== 'Local'" />
      </el-form-item>
      <el-form-item :label="$t('ui.englishName')" prop="english_name">
        <el-input v-model="userForm.english_name" />
      </el-form-item>
      <el-form-item :label="$t('ui.title')" prop="title">
        <el-select v-model="userForm.title" filterable>
          <el-option v-for="title in titles" :key="title" :label="title" :value="title" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ui.department')" prop="dept">
        <el-select v-model="userForm.dept" filterable>
          <el-option v-for="dept in depts" :key="dept" :label="dept" :value="dept" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ui.manager')" prop="manager">
        <el-select v-model="selectedManager" value-key="_id" filterable>
          <el-option v-for="manager in managers" :key="manager._id" :label="manager.name" :value="manager" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('ui.isManager')" prop="is_manager">
        <el-switch v-model="userForm.is_manager" />
      </el-form-item>
      <el-form-item :label="$t('ui.city')" prop="city">
        <el-select v-model="userForm.city" filterable allow-create>
          <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
        </el-select>
      </el-form-item>
    </template>
    <el-form-item :label="$t('ui.groups')" prop="groups">
      <el-transfer
        v-model="userForm.groups"
        v-loading="loadingGroups"
        filterable
        :data="groupTransferItems"
        :titles="[$t('ui.allGroups'), $t('ui.userGroups')]" />
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
import { fetchGroupsInfo } from '@/api/groups';
import {
  addUser,
  fetchUser,
  queryCities,
  queryDepts,
  queryManagers,
  queryTitles,
  updateUser
} from '@/api/users';
import PasswordFormItem from '@/components/PasswordFormItem';

export default {
  name: 'UserDetail',
  components: { PasswordFormItem },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      userForm: {
        type: 'Local',
        password: '',
        manager: null,
        groups: [],
      },
      loadingGroups: false,
      groupTransferItems: [],
      groupIds: {},
      immutableGroupIds: {},
      titles: [],
      depts: [],
      managers: [],
      cities: [],
      submitting: false,
    };
  },
  computed: {
    selectedManager: {
      get() {
        if (this.userForm.manager) {
          return this.userForm.manager;
        }
        return null;
      },
      set(value) {
        if (value) {
          this.userForm.manager = { _id: value._id, name: value.name };
        } else {
          this.userForm.manager = null;
        }
      }
    }
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      if (this.isEdit) {
        const _id = this.$route.params && this.$route.params._id;
        fetchUser(_id)
          .then(response => {
            const data = response.data;
            const immutableGroups = data.immutable_groups || [];
            const groups = data.groups || [];
            this.userForm = data;
            this.userForm.groups = [];
            immutableGroups.forEach(group => {
              this.userForm.groups.push(group._id);
              this.immutableGroupIds[group._id] = group.name;
            });
            groups.forEach(group => {
              this.userForm.groups.push(group._id);
            });

            if (this.userForm.type === 'Local') {
              this.queryTitles();
              this.queryDepts();
              this.queryManagers();
              this.queryCities();
            }
            this.fetchGroupsInfo();
          })
          .catch(error => {
            if (error.response.status === 404) {
              this.$router.replace('/404').catch(() => {});
            } else {
              this.$router.push({ name: 'userList' }).catch(() => {});
            }
          });
      } else {
        this.queryTitles();
        this.queryDepts();
        this.queryManagers();
        this.queryCities();
        this.fetchGroupsInfo();
      }
    },
    queryTitles() {
      queryTitles()
        .then(response => {
          this.titles = response.data;
        })
        .catch(() => {});
    },
    queryDepts() {
      queryDepts()
        .then(response => {
          this.depts = response.data;
        })
        .catch(() => {});
    },
    queryManagers() {
      queryManagers()
        .then(response => {
          this.managers = response.data;
          this.managers.unshift('');
        })
        .catch(() => {});
    },
    queryCities() {
      queryCities()
        .then(response => {
          this.cities = response.data;
        })
        .catch(() => {});
    },
    fetchGroupsInfo() {
      this.loadingGroups = true;
      fetchGroupsInfo()
        .then(response => {
          const groupTransferItems = [];
          response.data.forEach(group => {
            groupTransferItems.push({
              key: group._id,
              label: group.name,
              disabled: !!this.immutableGroupIds[group._id],
            });
            this.groupIds[group._id] = group.name;
          });
          this.groupTransferItems = groupTransferItems;
        })
        .catch(() => {})
        .finally(() => {
          this.loadingGroups = false;
        });
    },
    onSubmit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const submitFunc = this.isEdit ? updateUser : addUser;
          const _id = this.$route.params && this.$route.params._id;
          const userData = { ...this.userForm };
          if (userData.password === '$encrypted') delete userData.password;
          let groupIds = userData.groups;

          // Remove the immutable groups
          groupIds = groupIds.slice(Object.keys(this.immutableGroupIds).length);

          // Remove the groups don't exist anymore and set the value of groups
          const groups = [];
          groupIds.forEach(groupId => {
            if (!this.isEdit || this.groupIds[groupId]) {
              groups.push({ _id: groupId, name: this.groupIds[groupId] });
            }
          });
          userData.groups = groups;

          submitFunc(userData, _id)
            .then(() => {
              this.$message({
                message: this.$t('message.form.submitted'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              this.$router.push({ name: 'userList' }).catch(() => {});
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
      this.$router.push({ name: 'userList' }).catch(() => {});
    },
  }
};
</script>
