<script setup lang="ts">
import { useStore } from '@/stores/store'
import { type Device } from '@/types/device'
import Channel from './Channel.vue'
import Wifi from './Wifi.vue'
import Alarm from './Alarm.vue'
import Actions from './Actions.vue'

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
            <v-icon name="co-caret-bottom" color="green" />
          </button>
          <input
            :disabled="
              store.mode === 'archive' && store.hasSelectedArchiveDevice && !device.selected
            "
            :id="`device-${device.id}`"
            type="checkbox"
            :checked="device.selected"
            @change="onChange"
          />
          <label :for="`device-${device.id}`" :title="device.name" class="device__name">{{
            device.name
          }}</label>
        </div>

        <div class="device__statuses" v-if="store.mode === 'online'">
          <v-icon name="co-truck" :width="20" :height="20" />
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
  gap: 6px;
}

.device__selectBlock {
  display: flex;
  align-items: center;
}

.device__statuses {
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: flex-end;
  align-items: center;
}

.device__channels {
  margin-top: 4px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  gap: 8px;
}

.device__openButton {
  border: none;
  background: none;
  padding: 0;
  transition: transform 0.3s;
  transform: rotate(-90deg);
  cursor: pointer;
}

.device__openButton_opened {
  transform: rotate(0deg);
}

.device__name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex: 1;
}
</style>
