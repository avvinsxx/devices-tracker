<script setup lang="ts">
const { size = 24 } = defineProps<{ size?: number }>()
</script>

<template>
  <svg
    :style="{ width: `${size}px`, height: `${size}px` }"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0134 19.1417L0.765625 6.49444V4.875H23.25V6.58359L12.0134 19.1417ZM2.66683 6.375L12.0168 16.8885L21.4239 6.375H2.66683Z"
      fill="currentColor"
    />
  </svg>
</template>
