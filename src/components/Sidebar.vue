<script setup lang="ts">
import { useStore } from '@/stores/store'
import Device from './Device.vue'
import Group from './Group.vue'
import Loader from './Loader.vue'
import Mode from './Mode.vue'

const store = useStore()
</script>

<template>
  <div class="sidebar">
    <Mode class="sidebar__mode" />
    <input placeholder="Название или Id" v-model="store.query" class="sidebar__input" />

    <div class="sidebar__devices">
      <div v-if="store.isLoading" class="sidebar__loaderContainer"><Loader /></div>
      <template v-else>
        <Group v-for="group in store.groups" :key="group.id" :group="group" />
        <Device v-for="device in store.ungroupedDevices" :key="device.id" :device />
      </template>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 300px;
  background-color: var(--bg-surface-light);
  display: flex;
  gap: var(--spacing-2xl);
  flex-direction: column;
  padding: var(--spacing-xl);
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: var(--shadow-1);
  z-index: 1;
}

.sidebar__mode {
  align-self: center;
}

.sidebar__input {
  padding: 7px 5px;
  box-shadow: var(--shadow-1);
  border: none;
}

.sidebar__devices {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.sidebar__loaderContainer {
  text-align: center;
}
</style>
