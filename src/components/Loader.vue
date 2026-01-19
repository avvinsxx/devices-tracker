<script setup lang="ts">
const { size = 24 } = defineProps<{ size?: number }>()
</script>

<template>
  <span class="loader" :style="{ width: `${size}px`, height: `${size}px` }"></span>
</template>

<style>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid var(--color-loader);
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
