import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

import { type Group } from '@/types/group'
import type { Device, DeviceMap } from '@/types/device'
import { loadFromStorage, saveToStorage } from '@/utils/localStorage'
import { useWebsocketStore } from './websocketStore'

type Mode = 'online' | 'archive'

const STORAGE_KEYS = {
  MODE: 'mode',
  OPENED_GROUPS: 'opened-groups',
  OPENED_DEVICES: 'opened-devices',
  SELECTED_DEVICES_ONLINE: 'selected-devices-online',
  SELECTED_CHANNELS_ONLINE: 'selected-channels-online',
  SELECTED_DEVICE_ARCHIVE: 'selected-device-archive',
  SELECTED_CHANNELS_ARCHIVE: 'selected-channels-archive',
}

export const useStore = defineStore('store', () => {
  const mode = ref<Mode>(loadFromStorage(STORAGE_KEYS.MODE, 'online'))
  function changeMode(newMode: Mode) {
    mode.value = newMode
  }
  function toggleMode() {
    mode.value = mode.value === 'online' ? 'archive' : 'online'
  }

  const websocketStore = useWebsocketStore()

  const openedGroups = ref<string[]>(loadFromStorage(STORAGE_KEYS.OPENED_GROUPS, []))
  function openGroupToggle(groupId: string) {
    if (openedGroups.value.includes(groupId)) {
      openedGroups.value = openedGroups.value.filter((id) => id !== groupId)
    } else {
      openedGroups.value.push(groupId)
    }
  }

  const openedDevices = ref<number[]>(loadFromStorage(STORAGE_KEYS.OPENED_DEVICES, []))
  function openDeviceToggle(deviceId: number) {
    if (openedDevices.value.includes(deviceId)) {
      openedDevices.value = openedDevices.value.filter((id) => id !== deviceId)
    } else {
      openedDevices.value.push(deviceId)
    }
  }

  const selectedDevicesOnline = ref<number[]>(
    loadFromStorage(STORAGE_KEYS.SELECTED_DEVICES_ONLINE, []),
  )
  const selectedChannelsOnline = ref<Record<number, number[]>>(
    loadFromStorage(STORAGE_KEYS.SELECTED_CHANNELS_ONLINE, {}),
  )
  const selectedDeviceArchive = ref<number | undefined>(
    loadFromStorage(STORAGE_KEYS.SELECTED_DEVICE_ARCHIVE, undefined),
  )
  const selectedChannelsArchive = ref<Record<number, number[]>>(
    loadFromStorage(STORAGE_KEYS.SELECTED_CHANNELS_ARCHIVE, {}),
  )

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
    const selectedChannels =
      mode.value === 'online' ? selectedChannelsOnline : selectedChannelsArchive
    if (!selectedChannels.value.hasOwnProperty(deviceId)) {
      selectedChannels.value[deviceId] = []
    }
    const deviceSelectedChannels = selectedChannels.value[deviceId]
    if (deviceSelectedChannels?.includes(channel)) {
      selectedChannels.value[deviceId] = deviceSelectedChannels.filter((id) => id !== channel)
    } else {
      selectedChannels.value[deviceId]?.push(channel)
    }
  }

  const groups = computed<Group[]>(() => {
    if (!websocketStore.groups || !websocketStore.devices) return []
    return websocketStore.groups.map((g) => ({
      ...g,
      isOpen: openedGroups.value.includes(g.id),
      devices: g.deviceIds.map((id) => {
        const device = websocketStore.devices?.[id]
        if (!device) throw new Error(`Устройство ${id} не найдено`)
        return {
          ...device,
          isOpen: openedDevices.value.includes(id),
          selected:
            mode.value === 'online'
              ? selectedDevicesOnline.value.includes(id)
              : selectedDeviceArchive.value === id,
          channels: Array.from({ length: device.channels }, (_, index) => ({
            number: index + 1,
            selected:
              mode.value === 'online'
                ? !!selectedChannelsOnline.value[id]?.includes(index + 1)
                : !!selectedChannelsArchive.value[id]?.includes(index + 1),
          })),
        }
      }),
    }))
  })

  const ungroupedDevices = computed<Device[]>(() => {
    if (!websocketStore.groups || !websocketStore.devices) return []
    const groupedDevices = websocketStore.groups.map((g) => g.deviceIds).flat()

    return Object.keys(websocketStore.devices)
      .filter((id) => !groupedDevices.includes(Number(id)))
      .map((id) => {
        const numId = Number(id)
        const device = websocketStore.devices?.[id]
        if (!device) throw new Error(`Устройство ${id} не найдено`)
        return {
          ...device,
          isOpen: openedDevices.value.includes(numId),
          selected:
            mode.value === 'online'
              ? selectedDevicesOnline.value.includes(numId)
              : selectedDeviceArchive.value === numId,
          channels: Array.from({ length: device.channels }, (_, index) => ({
            number: index + 1,
            selected:
              mode.value === 'online'
                ? !!selectedChannelsOnline.value[numId]?.includes(index + 1)
                : !!selectedChannelsArchive.value[numId]?.includes(index + 1),
          })),
        }
      })
  })

  const canAddNewDevice = computed<boolean>(() => {
    return mode.value === 'online' || (mode.value === 'archive' && !selectedDeviceArchive.value)
  })

  const devicesForMap = computed<DeviceMap[]>(() => {
    if (!websocketStore.devices) return []
    return Object.keys(websocketStore.devices)
      .filter((id) =>
        mode.value === 'online'
          ? selectedDevicesOnline.value.includes(Number(id))
          : selectedDeviceArchive.value === Number(id),
      )
      .map((id) => {
        const device = websocketStore.devices?.[id]
        if (!device) throw new Error(`Устройство ${id} не найдено`)
        return device
      })
  })

  const isLoading = computed<boolean>(() => !websocketStore.groups || !websocketStore.devices)

  function deleteDevice(deviceId: number) {
    websocketStore.deleteDevice(deviceId)

    openedDevices.value = openedDevices.value.filter((id) => id !== deviceId)
    selectedDevicesOnline.value = selectedDevicesOnline.value.filter((id) => id !== deviceId)
    delete selectedChannelsOnline.value[deviceId]

    selectedDeviceArchive.value = undefined
    delete selectedChannelsArchive.value[deviceId]
  }

  watch(mode, (newMode) => {
    saveToStorage(STORAGE_KEYS.MODE, newMode)
  })

  watch(
    openedGroups,
    (newGroups) => {
      saveToStorage(STORAGE_KEYS.OPENED_GROUPS, newGroups)
    },
    { deep: true },
  )

  watch(
    openedDevices,
    (newDevices) => {
      saveToStorage(STORAGE_KEYS.OPENED_DEVICES, newDevices)
    },
    { deep: true },
  )

  watch(
    selectedDevicesOnline,
    (newSelected) => {
      saveToStorage(STORAGE_KEYS.SELECTED_DEVICES_ONLINE, newSelected)
    },
    { deep: true },
  )

  watch(
    selectedChannelsOnline,
    (newChannels) => {
      saveToStorage(STORAGE_KEYS.SELECTED_CHANNELS_ONLINE, newChannels)
    },
    { deep: true },
  )

  watch(selectedDeviceArchive, (newDevice) => {
    saveToStorage(STORAGE_KEYS.SELECTED_DEVICE_ARCHIVE, newDevice)
  })

  watch(
    selectedChannelsArchive,
    (newChannels) => {
      saveToStorage(STORAGE_KEYS.SELECTED_CHANNELS_ARCHIVE, newChannels)
    },
    { deep: true },
  )

  return {
    isLoading,
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
    canAddNewDevice,
    devicesForMap,
    deleteDevice,
  }
})
