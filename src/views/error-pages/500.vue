<template>
  <error-page :img="img" :text="$t('message.page500')" :button="button" />
</template>

<script>
import ErrorPage from './components/ErrorPage';
import img from '@/assets/500.svg';

export default {
  name: 'Page500',
  components: { ErrorPage },
  data() {
    let button = this.$route.params.button;
    if (button == undefined) {
      button = false;
    }
    return {
      img,
      button,
    };
  }
};
</script>
