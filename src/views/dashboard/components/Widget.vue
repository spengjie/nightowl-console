<template>
  <card class="widget" header-class="widget-header">
    <template #header>
      <span class="widget-title">header</span>
      <div class="right-bar">
        <el-dropdown trigger="click">
          <i class="el-icon-setting" style="cursor: pointer" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>item 1</el-dropdown-item>
            <el-dropdown-item>item 2</el-dropdown-item>
            <el-dropdown-item>item 3</el-dropdown-item>
            <el-dropdown-item disabled>item 4</el-dropdown-item>
            <el-dropdown-item divided>item 5</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </template>
  </card>
</template>

<script>
import Card from '@/components/Card';

export default {
  name: 'Widget',
  components: { Card },
};
</script>
