<script setup lang="ts"></script>

<template>
  <v-icon name="co-warning" :width="20" :height="20" color="red" class="alarm" />
</template>

<style>
.alarm {
  animation: 0.6s infinite pulse alternate linear;
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
