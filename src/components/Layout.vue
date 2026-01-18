<script setup lang="ts">
import Map from './Map.vue'
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <Map />
  </div>
</template>

<style scoped>
.layout {
  height: 100dvh;
  display: flex;
}
</style>
