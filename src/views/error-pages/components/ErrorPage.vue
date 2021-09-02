<template>
  <div class="error-page-wrapper">
    <no-data :img="img">
      <div class="no-data-item">
        {{ text }}
      </div>
      <div v-if="button" class="no-data-item">
        <el-button type="primary" plain size="small" icon="el-icon-arrow-left" @click="backToPrevious">
          {{ $t('ui.backToPrevious') }}
        </el-button>
        <el-button type="primary" plain size="small" icon="el-icon-s-home" @click="backToHome">
          {{ $t('ui.backToHome') }}
        </el-button>
      </div>
    </no-data>
  </div>
</template>

<script>
import NoData from '@/components/NoData';

export default {
  name: 'ErrorPage',
  components: { NoData },
  props: {
    img: String,
    text: {
      type: String,
      required: true,
    },
    button: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    backToHome() {
      this.$router.push('/').catch(() => {});
    },
    backToPrevious() {
      this.$router.back();
    },
  }
};
</script>
