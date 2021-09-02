<template>
  <error-page :img="img" :text="$t('message.page404')" />
</template>

<script>
import ErrorPage from './components/ErrorPage';
import img from '@/assets/404.svg';

export default {
  name: 'Page404',
  components: { ErrorPage },
  data() {
    return { img };
  }
};
</script>
