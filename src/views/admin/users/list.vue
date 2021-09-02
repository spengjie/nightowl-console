<template>
  <item-list type="users" :filter-keys="filterKeys">
    <el-table-column prop="username" :label="$t('ui.username')" width="100" />
    <el-table-column prop="type" :label="$t('ui.type')" min-width="100" />
    <el-table-column prop="employee_id" :label="$t('ui.employeeId')" width="110" />
    <el-table-column prop="name" :label="$t('ui.name')" min-width="100" />
    <el-table-column prop="english_name" :label="$t('ui.englishName')" min-width="160" />
    <el-table-column prop="email" :label="$t('ui.email')" min-width="220" />
    <el-table-column prop="title" :label="$t('ui.title')" min-width="180" />
    <el-table-column prop="dept" :label="$t('ui.department')" min-width="230" />
    <el-table-column prop="manager.name" :label="$t('ui.manager')" min-width="100" />
    <el-table-column prop="city" :label="$t('ui.city')" min-width="55" />
    <el-table-column
      prop="groups"
      :label="$t('ui.groups')"
      min-width="280">
      <template #default="{ row }">
        <el-tag
          v-for="group in row.groups"
          :key="group._id">
          {{ group.name }}
        </el-tag>
        <el-tag
          v-for="group in row.immutable_groups"
          :key="group._id"
          type="info">
          {{ group.name }}
        </el-tag>
      </template>
    </el-table-column>
  </item-list>
</template>

<script>
import ItemList from './components/ItemList';

export default {
  name: 'UserList',
  components: {
    ItemList,
  },
  data() {
    return {
      filterKeys: [
        { value: 'username', label: 'username' },
        { value: 'type', label: 'type' },
        { value: 'employee_id', label: 'employeeId' },
        { value: 'name', label: 'name' },
        { value: 'english_name', label: 'englishName' },
        { value: 'email', label: 'email' },
        { value: 'title', label: 'title' },
        { value: 'dept', label: 'department' },
        { value: 'manager.name', label: 'manager' },
        { value: 'is_manager', label: 'isManager', type: 'bool' },
        { value: 'city', label: 'city' },
        { value: 'groups.name', label: 'group' },
      ]
    };
  }
};
</script>
