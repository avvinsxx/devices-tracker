<script setup lang="ts">
const { size = 24 } = defineProps<{ size?: number }>()
</script>

<template>
  <svg
    :style="{ scale: size / 24 }"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_201_57072)">
      <path d="M12.75 8.25H11.25V16.5H12.75V8.25Z" />
      <path d="M12.75 18H11.25V19.5H12.75V18Z" />
      <path
        d="M12.8444 0.75H11.1556L0.75 20.8675V23.25H23.25V20.8675L12.8444 0.75ZM21.75 21.75H2.25V21.2325L12 2.38247L21.75 21.2325V21.75Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_201_57072">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>
