<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

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
      <v-icon name="io-ellipsis-vertical-sharp" :width="20" :height="20" />
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
}

.actions__opener {
  border: none;
  background: none;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
}

.actions__list {
  position: absolute;
  top: 20px;
  right: 0;

  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}

.actions__action {
  border: none;
  width: 100%;
  text-align: left;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
