<template>
  <item-list type="groups" :filter-keys="filterKeys">
    <el-table-column prop="name" :label="$t('ui.name')" min-width="140" />
    <el-table-column prop="type" :label="$t('ui.type')" min-width="100" />
    <el-table-column
      prop="permissions"
      :label="$t('ui.permissions')"
      min-width="150">
      <template #default="{ row }">
        <el-tag
          v-for="permission in row.permissions"
          :key="permission">
          {{ permission }}
        </el-tag>
      </template>
    </el-table-column>
  </item-list>
</template>

<script>
import ItemList from '../users/components/ItemList';

export default {
  name: 'GroupList',
  components: {
    ItemList,
  },
  data() {
    return {
      filterKeys: [
        { value: 'name', label: 'name' },
        { value: 'type', label: 'type' },
        { value: 'permissions', label: 'permissions' },
      ]
    };
  }
};
</script>
