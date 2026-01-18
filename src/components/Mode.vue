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
  gap: 8px;
}

.mode__label {
  color: gray;
  border: none;
  background: none;
  cursor: pointer;
}

.mode__label_active {
  color: black;
}
</style>
