import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { groups as wsGroups, devices as wsDevices } from '@/data/WsService'
import { type Group } from '@/types/group'
import type { Device, DeviceMap } from '@/types/device'

type Mode = 'online' | 'archive'

export const useStore = defineStore('store', () => {
  const mode = ref<Mode>('online')
  function changeMode(newMode: Mode) {
    mode.value = newMode
  }

  function toggleMode() {
    mode.value = mode.value === 'online' ? 'archive' : 'online'
  }

  const openedGroups = ref<string[]>([])
  function openGroupToggle(groupId: string) {
    if (openedGroups.value.includes(groupId)) {
      openedGroups.value = openedGroups.value.filter((id) => id !== groupId)
    } else {
      openedGroups.value.push(groupId)
    }
  }

  const openedDevices = ref<number[]>([])
  function openDeviceToggle(deviceId: number) {
    if (openedDevices.value.includes(deviceId)) {
      openedDevices.value = openedDevices.value.filter((id) => id !== deviceId)
    } else {
      openedDevices.value.push(deviceId)
    }
  }

  const selectedDevicesOnline = ref<number[]>([])
  const selectedChannelsOnline = ref<Record<number, number[]>>({})
  const selectedDeviceArchive = ref<number>()
  const selectedChannelsArchive = ref<Record<number, number[]>>({})

  function selectDevice(deviceId: number) {
    if (mode.value === 'online') {
      if (selectedDevicesOnline.value.includes(deviceId)) {
        selectedDevicesOnline.value = selectedDevicesOnline.value.filter((id) => id !== deviceId)
      } else {
        selectedDevicesOnline.value.push(deviceId)
      }
    } else {
      if (selectedDeviceArchive.value === deviceId) {
        selectedDeviceArchive.value = undefined
      } else {
        selectedDeviceArchive.value = deviceId
      }
    }
  }

  function selectChannel(deviceId: number, channel: number) {
    if (mode.value === 'online') {
      if (!selectedChannelsOnline.value.hasOwnProperty(deviceId)) {
        selectedChannelsOnline.value[deviceId] = []
      }
      const selectedChannels = selectedChannelsOnline.value[deviceId]
      if (selectedChannels?.includes(channel)) {
        selectedChannelsOnline.value[deviceId] = selectedChannels.filter((id) => id !== channel)
      } else {
        selectedChannelsOnline.value[deviceId]?.push(channel)
      }
    } else {
      selectedDeviceArchive.value = deviceId
    }
  }

  const groups = computed<Group[]>(() => {
    return wsGroups.map((g) => ({
      ...g,
      isOpen: openedGroups.value.includes(g.id),
      devices: g.deviceIds.map((id) => ({
        ...wsDevices[id],
        isOpen: openedDevices.value.includes(id),
        selected:
          mode.value === 'online'
            ? selectedDevicesOnline.value.includes(id)
            : selectedDeviceArchive.value === id,
        channels: Array.from({ length: wsDevices[id].channels }, (_, index) => ({
          number: index + 1,
          selected:
            mode.value === 'online' ? selectedChannelsOnline.value[id]?.includes(index + 1) : false,
        })),
      })),
    }))
  })

  const ungroupedDevices = computed<Device[]>(() => {
    const groupedDevices = wsGroups.map((g) => g.deviceIds).flat()

    return Object.keys(wsDevices)
      .filter((id) => !groupedDevices.includes(Number(id)))
      .map((id) => {
        const numId = Number(id)
        return {
          ...wsDevices[id],
          isOpen: openedDevices.value.includes(numId),
          selected:
            mode.value === 'online'
              ? selectedDevicesOnline.value.includes(numId)
              : selectedDeviceArchive.value === numId,
          channels: Array.from({ length: wsDevices[numId].channels }, (_, index) => ({
            number: index + 1,
            selected:
              mode.value === 'online'
                ? selectedChannelsOnline.value[numId]?.includes(index + 1)
                : false,
          })),
        }
      })
  })

  const hasSelectedArchiveDevice = computed<boolean>(() => {
    return !!selectedDeviceArchive.value
  })

  const devicesForMap = computed<DeviceMap[]>(() => {
    console.log('aaa')
    return Object.keys(wsDevices)
      .filter((id) =>
        mode.value === 'online'
          ? selectedDevicesOnline.value.includes(Number(id))
          : selectedDeviceArchive.value === Number(id),
      )
      .map((id) => wsDevices[Number(id)])
  })

  return {
    selectedDevicesOnline,
    mode,
    changeMode,
    toggleMode,
    groups,
    ungroupedDevices,
    openGroupToggle,
    openDeviceToggle,
    selectDevice,
    selectChannel,
    hasSelectedArchiveDevice,
    devicesForMap,
  }
})
