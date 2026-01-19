<script setup lang="ts">
import WarningIcon from './Icons/WarningIcon.vue'
</script>

<template>
  <WarningIcon :size="20" class="alarm" />
</template>

<style>
.alarm {
  animation: 0.6s infinite pulse alternate linear;
  fill: var(--color-error);
}

@keyframes pulse {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
