<script setup lang="ts">
import { useStore } from '@/stores/store'
import Switcher from './Switcher.vue'

const store = useStore()

function onOnlineClick() {
  store.changeMode('online')
}

function onArchiveClick() {
  store.changeMode('archive')
}

function onSwitcherClick() {
  store.toggleMode()
}
</script>

<template>
  <div class="mode">
    <button
      class="mode__label"
      :class="{ mode__label_active: store.mode === 'archive' }"
      @click="onArchiveClick"
    >
      Archive
    </button>
    <Switcher :active="store.mode === 'online'" @click="onSwitcherClick" />
    <button
      class="mode__label"
      :class="{ mode__label_active: store.mode === 'online' }"
      role="button"
      @click="onOnlineClick"
    >
      Online
    </button>
  </div>
</template>

<style scoped>
.mode {
  display: flex;
  gap: var(--spacing-md);
}

.mode__label {
  color: var(--text-light);
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 600;
}

.mode__label_active {
  color: var(--text-dark);
}
</style>
