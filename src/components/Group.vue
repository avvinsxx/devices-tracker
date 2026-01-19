<script setup lang="ts">
import { useStore } from '@/stores/store'
import { type Group } from '@/types/group'
import Device from './Device.vue'
import CaretIcon from './Icons/CaretIcon.vue'

const { group } = defineProps<{ group: Group }>()

const store = useStore()

function onOpen() {
  store.openGroupToggle(group.id)
}
</script>

<template>
  <div class="group">
    <div
      class="group__header"
      @click.prevent="onOpen"
      @keyup.space.enter="onOpen"
      role="button"
      tabindex="0"
    >
      {{ group.name }}
      <CaretIcon :size="16" class="group__caret" :class="{ group__caret_open: group.isOpen }" />
    </div>
    <div v-if="group.isOpen" class="group__body">
      <Device v-for="device in group.devices" :device="device" :key="device.id" />
    </div>
  </div>
</template>

<style scoped>
.group {
  box-shadow: var(--shadow-1);
}

.group__header {
  background-color: var(--bg-surface-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  cursor: pointer;
  font-size: var(--font-size-h);
}

.group__body {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.group__caret {
  transition: transform 0.5s;
}

.group__caret_open {
  transform: rotate(180deg);
}
</style>
