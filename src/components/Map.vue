<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Placemark } from 'yandex-maps'

import { useStore } from '@/stores/store'
import { calculateDeviceBounds, loadYmaps } from '@/utils/map'
import type ymaps from 'yandex-maps'

const store = useStore()
const markers = new Map<number, Placemark>()
const mapLoaded = ref(false)

let ymapsApi: typeof ymaps
let map: ymaps.Map

function initMap() {
  ymapsApi = window.ymaps
  map = new ymapsApi.Map('map', {
    center: [55.76, 37.64],
    controls: [],
    zoom: 7,
  })
  mapLoaded.value = true
}

onMounted(async () => {
  try {
    await loadYmaps()
    initMap()
  } catch (error) {
    console.error('Ошибка загрузки Яндекс Карт:', error)
  }
})

watch(
  [() => store.devicesForMap, () => store.mode, () => mapLoaded.value],
  ([newDevices, newMode], [_, oldMode]) => {
    if (map) {
      const deviceIds = newDevices.map((d) => d.id)
      for (const markerDeviceId of markers.keys()) {
        if (!deviceIds.includes(markerDeviceId) || newMode !== oldMode) {
          map.geoObjects.remove(markers.get(markerDeviceId)!)
          markers.delete(markerDeviceId)
        }
      }

      for (const device of newDevices) {
        if (!markers.has(device.id)) {
          const deviceMarker = new ymapsApi.Placemark(
            [device.lat, device.lon],
            {
              balloonContent: `
                <h1>${device.name}</h1>
                <p>id: ${device.id}</p>
                <p>Каналов: ${device.channels}</p>
                <p>Время: ${device.timestamp}</p>
                <p>Широта: ${device.lat}, Долгота: ${device.lon}</p>
              `,
              hintContent: device.name,
            },
            {
              iconImageHref: '',
              iconLayout: 'default#imageWithContent',
              iconContentLayout: ymapsApi.templateLayoutFactory.createClass(
                `<div class="map__marker ${store.mode === 'online' && device.alarm ? 'map__marker_alarm' : ''}"></div>`,
              ),
              iconContentOffset: [-10, -10],
              // @ts-expect-error: Ошибка в типах библиотеки
              iconImageShape: {
                type: 'Circle',
                coordinates: [0, 0],
                radius: 15,
              },

              iconContentSize: [20, 20],
            },
          )
          map.geoObjects.add(deviceMarker)
          markers.set(device.id, deviceMarker)
        }
      }

      const bounds = calculateDeviceBounds(newDevices)
      if (bounds)
        map.setBounds(bounds, {
          duration: 500,
        })
    }
  },
)
</script>

<template>
  <div id="map" class="map"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>

<style>
.map__marker {
  background-color: var(--marker);
  width: 20px;
  height: 20px;
  border-radius: 20px;
}

.map__marker_alarm {
  background-color: var(--marker-alarm);
}
</style>
