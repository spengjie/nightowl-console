<template>
  <el-main class="dashboard">
    <div style="padding: 10px 10px 0 10px">
      <template v-if="!editing">
        <el-button type="text" @click="editing = true">
          {{ $t('ui.edit') }}
        </el-button>
      </template>
      <template v-else>
        <el-button type="text" @click="editing = false">
          {{ $t('ui.save') }}
        </el-button>
        <el-button type="text" @click="editing = false">
          {{ $t('ui.cancel') }}
        </el-button>
        <el-button type="text" @click="editing = false">
          {{ $t('ui.add') }}
        </el-button>
      </template>
      <div class="right-bar">
        <el-button type="text" @click="onFullScreen">
          Full Screen
        </el-button>
      </div>
    </div>
    <grid-layout ref="dashboardContent" :layout="widgetLayout" :row-height="50" :is-draggable="editing" :is-resizable="editing">
      <grid-item
        v-for="item in widgetLayout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-h="2"
        drag-allow-from=".widget-title"
        :class="{ 'vue-draggable': editing }">
        <widget>
          <template #header>
            asdasd
          </template>
          asdsad
        </widget>
      </grid-item>
    </grid-layout>
  </el-main>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import Widget from './components/Widget';

export default {
  name: 'Dashboard',
  components: {
    GridItem,
    GridLayout,
    Widget,
  },
  data() {
    return {
      editing: false,
      widgetLayout: [
        {'x':0,'y':0,'w':2,'h':2,'i':'0'},
        {'x':2,'y':0,'w':2,'h':4,'i':'1'},
        {'x':4,'y':0,'w':2,'h':5,'i':'2'},
        {'x':6,'y':0,'w':2,'h':3,'i':'3'},
        {'x':8,'y':0,'w':2,'h':3,'i':'4'},
        {'x':10,'y':0,'w':2,'h':3,'i':'5'},
        {'x':0,'y':5,'w':2,'h':5,'i':'6'},
        {'x':2,'y':5,'w':2,'h':5,'i':'7'},
        {'x':4,'y':5,'w':2,'h':5,'i':'8'},
        {'x':6,'y':3,'w':2,'h':4,'i':'9'},
        {'x':8,'y':4,'w':2,'h':4,'i':'10'},
        {'x':10,'y':4,'w':2,'h':4,'i':'11'},
        {'x':0,'y':10,'w':2,'h':5,'i':'12'},
        {'x':2,'y':10,'w':2,'h':5,'i':'13'},
        {'x':4,'y':8,'w':2,'h':4,'i':'14'},
        {'x':6,'y':8,'w':2,'h':4,'i':'15'},
        {'x':8,'y':10,'w':2,'h':5,'i':'16'},
        {'x':10,'y':4,'w':2,'h':2,'i':'17'},
        {'x':0,'y':9,'w':2,'h':3,'i':'18'},
        {'x':2,'y':6,'w':2,'h':2,'i':'19'},
      ]
    };
  },
  methods: {
    onFullScreen() {
      if (!document.fullscreenEnabled && !document.mozFullScreenEnabled && !document.msFullscreenEnabled) return;
      if (document.fullScreenElement || document.webkitIsFullScreen || document.msfullscreenElement) return;
      const elem = this.$refs.dashboardContent.$el;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen(); // Firefox
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); // Safari
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen(); // IE11
    }
  }
};
</script>
