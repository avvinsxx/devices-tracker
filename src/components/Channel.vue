<script setup lang="ts">
import { useStore } from '@/stores/store'
import { type Channel } from '@/types/channel'
import CameraIcon from './Icons/CameraIcon.vue'

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
    <CameraIcon :size="18" class="channel__icon" />
    {{ channel.number }}
  </button>
</template>

<style scoped>
.channel {
  padding: var(--spacing-sm);
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bg-channel-border);
  cursor: pointer;
  border-radius: var(--rounding-xs);
  transition: all 0.3s;
}

.channel:hover:not(.channel_unavailable) {
  background-color: var(--bg-channel-hover);
}

.channel_active {
  background-color: var(--bg-channel-active);
}

.channel_unavailable {
  cursor: not-allowed;
}

.channel_unavailable:hover,
.channel_unavailable:focus {
  border-color: var(--color-error);
}

.channel__icon {
  width: 20px;
  height: 20px;
  fill: var(--text-dark);
}
</style>
