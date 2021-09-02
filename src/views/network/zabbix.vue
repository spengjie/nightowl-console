<template>
  <zabbix :nnid="$route.params && $route.params._id" redirect-on-error />
</template>

<script>
import Zabbix from '@/views/components/Zabbix';

export default {
  name: 'NetworkObjectZabbix',
  components: { Zabbix },
};
</script>
