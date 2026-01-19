import { ref } from 'vue'
import { defineStore } from 'pinia'

import { WSMock } from '@/data/WsMock'
import type { WsDevice, WsGroup, WsMessage } from '@/data/types'

export const useWebsocketStore = defineStore('websocket', () => {
  const groups = ref<WsGroup[]>()
  const devices = ref<Record<string, WsDevice>>()

  const ws = new WSMock()

  ws.onMessage((message) => {
    const parsedMessage = JSON.parse(message) as WsMessage
    if (parsedMessage.type === 'devices') {
      devices.value = parsedMessage.data
    } else if (parsedMessage.type === 'groups') {
      groups.value = parsedMessage.data
    }
  })

  ws.connect()

  function deleteDevice(deviceId: number) {
    if (!devices.value || !groups.value) return

    groups.value = groups.value.map((g) => {
      return { ...g, deviceIds: g.deviceIds.filter((id) => id !== deviceId) }
    })
    delete devices.value[String(deviceId)]
  }

  return {
    groups,
    devices,
    deleteDevice,
  }
})
