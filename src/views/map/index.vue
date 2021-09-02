<template>
  <el-container>
    <el-aside class="side-pane">
      <explorer draggable />
    </el-aside>
    <el-main style="padding: 0">
      <g6-map />
    </el-main>
  </el-container>
</template>

<script>
import Explorer from '@/components/Explorer';
import G6Map from '@/components/Map';
// import VMapBrowser from '@/components/VMapBrowser'

export default {
  name: 'Map',
  components: {
    Explorer,
    G6Map,
    // VMapBrowser,
  },
};
</script>
