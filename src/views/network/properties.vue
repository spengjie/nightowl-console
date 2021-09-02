<template>
  <properties :nnid="$route.params && $route.params._id" redirect-on-error />
</template>

<script>
import Properties from '@/views/components/Properties';

export default {
  name: 'NetworkObjectProperties',
  components: { Properties },
};
</script>
