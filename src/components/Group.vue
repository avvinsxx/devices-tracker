<script setup lang="ts">
import { useStore } from '@/stores/store'
import { type Group } from '@/types/group'
import Device from './Device.vue'

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
      {{ group.name
      }}<v-icon
        name="co-caret-bottom"
        class="group__caret"
        :class="{ group__caret_open: group.isOpen }"
      />
    </div>
    <div v-if="group.isOpen" class="group__body">
      <Device v-for="device in group.devices" :device="device" :key="device.id" />
    </div>
  </div>
</template>

<style scoped>
.group {
  border: 1px solid red;
}

.group__header {
  background-color: red;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  font-size: var(--font-size-h);
}

.group__body {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.group__caret {
  transition: transform 0.5s;
}

.group__caret_open {
  transform: rotate(180deg);
}
</style>
