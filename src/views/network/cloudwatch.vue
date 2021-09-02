<template>
  <cloud-watch :nnid="$route.params && $route.params._id" redirect-on-error />
</template>

<script>
import CloudWatch from '@/views/components/CloudWatch';

export default {
  name: 'NetworkObjectCloudwatch',
  components: { CloudWatch },
};
</script>
