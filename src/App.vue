<template>
  <mine-sweeping />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MineSweeping from '@/components/MineSweeping.vue';

export default defineComponent({
  name: 'App',
  components: {
    MineSweeping
  }
});
</script>

<style lang="scss">
#app {
  display: inline-block;
}
</style>
