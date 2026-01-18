<script setup lang="ts">
import Device from './Device.vue'
import Group from './Group.vue'
import Mode from './Mode.vue'
import { useStore } from '@/stores/store'

const store = useStore()
</script>

<template>
  <div class="sidebar">
    <Mode class="sidebar__mode" />

    <div class="sidebar__devices">
      <Group v-for="group in store.groups" :key="group.id" :group="group" />
      <Device v-for="device in store.ungroupedDevices" :key="device.id" :device />
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 300px;
  background-color: cadetblue;
  display: flex;
  gap: 16px;
  flex-direction: column;
  padding: 12px;
  height: 100%;
}

.sidebar__mode {
  align-self: center;
}

.sidebar__devices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
