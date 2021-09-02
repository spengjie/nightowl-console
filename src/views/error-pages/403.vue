<template>
  <error-page :img="img" :text="$t('message.page403')" />
</template>

<script>
import ErrorPage from './components/ErrorPage';
import img from '@/assets/403.svg';

export default {
  name: 'Page403',
  components: { ErrorPage },
  data() {
    return { img };
  }
};
</script>
