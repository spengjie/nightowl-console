<template>
  <error-page :img="img" :text="$t('message.page401')" :button="false" />
</template>

<script>
import ErrorPage from './components/ErrorPage';
import img from '@/assets/403.svg';

export default {
  name: 'Page401',
  components: { ErrorPage },
  data() {
    return { img };
  }
};
</script>
