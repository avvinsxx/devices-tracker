<script setup lang="ts">
import { useStore } from '@/stores/store'
import { type Device } from '@/types/device'
import Channel from './Channel.vue'
import Wifi from './Wifi.vue'
import Alarm from './Alarm.vue'
import Actions from './Actions.vue'
import TruckIcon from './Icons/TruckIcon.vue'
import CaretIcon from './Icons/CaretIcon.vue'

const { device } = defineProps<{ device: Device }>()

const store = useStore()

function onChange() {
  store.selectDevice(device.id)
}

function onOpen() {
  store.openDeviceToggle(device.id)
}
</script>

<template>
  <div>
    <div class="device__device">
      <div class="device__deviceInfo">
        <div class="device__selectBlock">
          <button
            @click.prevent="onOpen"
            class="device__openButton"
            :class="{ device__openButton_opened: device.isOpen }"
          >
            <CaretIcon :size="16" />
          </button>

          <input
            :disabled="!store.canAddNewDevice && !device.selected"
            :id="`device-${device.id}`"
            type="checkbox"
            :checked="device.selected"
            @change="onChange"
          />
          <label
            :for="`device-${device.id}`"
            :title="device.name"
            class="device__name"
            :class="{ device__name_disabled: !store.canAddNewDevice && !device.selected }"
            >{{ device.name }}</label
          >
        </div>

        <div class="device__statuses" v-if="store.mode === 'online'">
          <TruckIcon :size="20" class="device__truckIcon" />
          <Wifi :strength="device.wifi" />
          <Alarm v-if="device.alarm" />
        </div>
      </div>
      <Actions :deviceId="device.id" />
    </div>
    <div v-if="device.isOpen" class="device__channels">
      <Channel
        v-for="channel in device.channels"
        :key="channel.number"
        :device-id="device.id"
        :device-selected="device.selected"
        :channel
      />
    </div>
  </div>
</template>

<style scoped>
.device__device {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.device__deviceInfo {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  min-width: 0;
}

.device__selectBlock {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: var(--spacing-xs);
}

.device__name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  min-width: 0;
}
.device__name_disabled {
  cursor: not-allowed;
}

.device__statuses {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-sm);
  align-items: flex-end;
  align-items: center;
}

.device__truckIcon {
  fill: var(--text-dark);
}

.device__channels {
  margin-top: var(--spacing-sm);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  gap: var(--spacing-md);
}

.device__openButton {
  border: none;
  background: none;
  padding: 0;
  transition: transform 0.3s;
  transform: rotate(-90deg);
  cursor: pointer;
  display: flex;
}

.device__openButton_opened {
  transform: rotate(0deg);
}
</style>
