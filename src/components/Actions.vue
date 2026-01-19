<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import OptionsIcon from './Icons/OptionsIcon.vue'

const isOpen = ref<boolean>(false)
const container = ref<HTMLElement>()

function onOpenerClick() {
  isOpen.value = !isOpen.value
}

function onOutsideClick(event: MouseEvent) {
  const target = event.target as Node

  if (container.value && !container.value.contains(target) && isOpen.value) {
    isOpen.value = false
  }
}

document.addEventListener('click', onOutsideClick)

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick)
})
</script>

<template>
  <div class="actions" ref="container">
    <button class="actions__opener" @click="onOpenerClick">
      <OptionsIcon :size="20" class="actions__openerIcon" />
    </button>
    <ul class="actions__list" v-show="isOpen">
      <li><button class="actions__action">Редактировать</button></li>
      <li><button class="actions__action">Удалить</button></li>
    </ul>
  </div>
</template>

<style scoped>
.actions {
  position: relative;
  height: 24px;
}

.actions__opener {
  border: none;
  background: none;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
}

.actions__opener:hover,
.actions__opener:focus {
  background-color: var(--bg-surface-dark);
}

.actions__openerIcon {
  fill: var(--text-dark);
}

.actions__list {
  position: absolute;
  top: 24px;
  right: 0;
  box-shadow: var(--shadow-2);

  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1;
  border-radius: var(--rounding-xs);
  overflow: hidden;
  background-color: var(--bg-surface-light);
}

.actions__action {
  border: none;
  width: 100%;
  text-align: left;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  background-color: transparent;
  font-weight: 500;
}

.actions__action:hover,
.actions__action:focus {
  background-color: var(--bg-surface-dark);
}
</style>
