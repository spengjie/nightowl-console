<template>
  <el-form
    ref="groupForm"
    :model="groupForm"
    label-width="auto">
    <el-form-item :label="$t('ui.name')" prop="name" required>
      <el-input v-model="groupForm.name" :disabled="groupForm.type !== 'Local'" />
    </el-form-item>
    <el-form-item :label="$t('ui.permissions')" prop="permissions">
      <el-tree
        ref="permissionTree"
        :data="permissionTreeData"
        show-checkbox
        node-key="path"
        default-expand-all
        :default-checked-keys="groupForm.permissions"
        class="checkbox-border-wrapper checkbox-tree">
        <template #default="{ node, data }">
          <div>
            <span>{{ node.label }}</span>
            <span v-if="data.type === 'permission'" class="text-secondary">
              ({{ data.path }})
            </span>
          </div>
        </template>
      </el-tree>
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
import { addGroup, fetchGroup, updateGroup } from '@/api/groups';
import { fetchPermissions } from '@/api/permissions';

export default {
  name: 'GroupDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      groupForm: {
        name: '',
        type: 'Local',
        permissions: [],
      },
      permissionTreeData: [],
      submitting: false,
    };
  },
  created() {
    this.fetchGroup();
    this.fetchPermissions();
  },
  methods: {
    fetchGroup() {
      if (!this.isEdit) return;
      const _id = this.$route.params && this.$route.params._id;
      fetchGroup(_id)
        .then(response => {
          this.groupForm = response.data;
        })
        .catch(error => {
          if (error.response.status === 404) {
            this.$router.replace('/404').catch(() => {});
          } else {
            this.$router.push({ name: 'groupList' }).catch(() => {});
          }
        });
    },
    fetchPermissions() {
      fetchPermissions()
        .then(response => {
          const data = response.data;
          this.permissionTreeData = [];
          for (const permission of data) {
            const exps = permission.split(':');

            const moduleExp = exps[0];
            const moduleSegs = moduleExp.split('.');
            // Find root module
            const rootModulPath = moduleSegs[0];
            let rootModule = this.permissionTreeData.find(item => item.path === rootModulPath);
            if (rootModule === undefined) {
              rootModule = {
                path: rootModulPath,
                label: rootModulPath,
                type: 'module',
                children: [],
              };
              this.permissionTreeData.push(rootModule);
            }
            let parentModule = rootModule;
            if (moduleSegs.length > 1) {
              let index = 1;
              while(index < moduleSegs.length) {
                const ancestorModulePath = moduleSegs.slice(0, index + 1).join('.');
                let ancestorModule = parentModule.children.find(item => item.path === ancestorModulePath);
                if (ancestorModule === undefined) {
                  ancestorModule = {
                    path: ancestorModulePath,
                    label: moduleSegs[index],
                    type: 'module',
                    children: [],
                  };
                  parentModule.children.push(ancestorModule);
                }
                parentModule = ancestorModule;
                index++;
              }
            }

            const permissionExp = exps[1];
            const permissionSegs = permissionExp.split('.');
            let parentNode = parentModule;
            if (permissionSegs.length > 1) {
              let index = 0;
              while(index < permissionSegs.length - 1) {
                const ancestorPermissionPath = parentModule.path + ':' + permissionSegs.slice(0, index + 1).join('.');
                let ancestorPermission = parentNode.children.find(item => item.path === ancestorPermissionPath);
                if (ancestorPermission === undefined) {
                  ancestorPermission = {
                    path: ancestorPermissionPath,
                    label: permissionSegs[index],
                    type: 'permission',
                    children: [],
                  };
                  parentNode.children.push(ancestorPermission);
                }
                parentNode = ancestorPermission;
                index++;
              }
            }
            parentNode.children.push({
                path: permission,
                label: permissionSegs[permissionSegs.length - 1],
                type: 'permission',
                children: [],
            });
          }
        })
        .catch(() => {});
    },
    onSubmit() {
      this.$refs.groupForm.validate(valid => {
        if (valid) {
          this.submitting = true;
          const submitFunc = this.isEdit ? updateGroup : addGroup;
          const _id = this.$route.params && this.$route.params._id;

          const groupData = {
            name: this.groupForm.name,
            type: this.groupForm.type,
            permissions: [],
          };

          this.$refs.permissionTree.getCheckedNodes().forEach(node => {
            if (node.type === 'permission') {
              groupData.permissions.push(node.path);
            }
          });

          submitFunc(groupData, _id)
            .then(() => {
              this.$message({
                message: this.$t('message.form.submitted'),
                type: 'success',
                showClose: true,
                duration: 2 * 1000,
              });
              this.$router.push({ name: 'groupList' }).catch(() => {});
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
      this.$router.push({ name: 'groupList' }).catch(() => {});
    },
  }
};
</script>
