<template>
  <div class="wrapper-center">
    <img :src="img" class="no-data-item" style="height: 250px">
    <slot>
      <div v-if="$slots.default || text" class="no-data-item">
        {{ text }}
      </div>
    </slot>
  </div>
</template>

<script>
import img from '@/assets/empty.svg';

export default {
  name: 'NoData',
  props: {
    img: {
      type: String,
      default: img,
    },
    text: String,
  }
};
</script>
