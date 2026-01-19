<script setup lang="ts">
const props = defineProps<{ active: boolean }>()
</script>

<template>
  <button class="switcher">
    <span class="switcher__check" :class="{ switcher__check_active: props.active }"></span>
  </button>
</template>

<style scoped>
.switcher {
  position: relative;
  background: gray;
  width: 56px;
  height: 28px;
  border-radius: 56px;
  border: none;
  cursor: pointer;
}

.switcher__check {
  height: 24px;
  width: 24px;
  border-radius: 24px;
  background-color: var(--color-accent);
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.switcher__check_active {
  transform: translate(27px);
}
</style>
