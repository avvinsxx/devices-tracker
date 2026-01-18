<script setup lang="ts">
import { useStore } from '@/stores/store'
import { type Channel } from '@/types/channel'

const { deviceId, deviceSelected, channel } = defineProps<{
  deviceId: number
  deviceSelected: boolean
  channel: Channel
}>()

const store = useStore()

function onClick() {
  if (deviceSelected) store.selectChannel(deviceId, channel.number)
}
</script>

<template>
  <button
    @click="onClick"
    class="channel"
    :class="{ channel_active: channel.selected, channel_unavailable: !deviceSelected }"
  >
    <v-icon name="co-camera" :width="20" :height="20" /> {{ channel.number }}
  </button>
</template>

<style scoped>
.channel {
  padding: 5px;
  border: 1 px solid black;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid red;
  cursor: pointer;
}

.channel_active {
  background-color: blue;
}

.channel_unavailable {
  cursor: not-allowed;
}
</style>
