<script setup lang="ts">
const { strength } = defineProps<{ strength: number }>()
</script>

<template>
  <div class="wifi">
    <div class="wifi__bar" v-for="s in strength" :key="s"></div>
  </div>
</template>

<style scoped>
.wifi {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 15px;
  width: 15px;
}

.wifi__bar {
  width: 2px;
  background: linear-gradient(to top, #ff4444, #44ff44);
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}

.wifi__bar:nth-child(1) {
  height: 3px;
  background: linear-gradient(to top, #ff4444, #ff7733);
}

.wifi__bar:nth-child(2) {
  height: 6px;
  background: linear-gradient(to top, #ff7733, #ffaa22);
}

.wifi__bar:nth-child(3) {
  height: 9px;
  background: linear-gradient(to top, #ffaa22, #ffcc11);
}

.wifi__bar:nth-child(4) {
  height: 12px;
  background: linear-gradient(to top, #ffcc11, #88dd44);
}

.wifi__bar:nth-child(5) {
  height: 15px;
  background: linear-gradient(to top, #88dd44, #44ff44);
}
</style>
