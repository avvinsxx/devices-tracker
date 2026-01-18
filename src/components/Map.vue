<script setup lang="ts">
import { watch } from 'vue'
import type { Placemark } from 'yandex-maps'

import { useStore } from '@/stores/store'
import { calculateDeviceBounds } from '@/utils/map'

const store = useStore()
const markers = new Map<number, Placemark>()

const ymaps = window.ymaps
ymaps.ready(init)

let myMap: ymaps.Map
function init() {
  myMap = new ymaps.Map('map', {
    center: [55.76, 37.64],
    controls: [],
    zoom: 7,
  })
}

watch([() => store.devicesForMap, () => store.mode], ([newDevices, newMode], [_, oldMode]) => {
  if (myMap) {
    const deviceIds = newDevices.map((d) => d.id)
    for (const markerDeviceId of markers.keys()) {
      if (!deviceIds.includes(markerDeviceId) || newMode !== oldMode) {
        myMap.geoObjects.remove(markers.get(markerDeviceId)!)
        markers.delete(markerDeviceId)
      }
    }

    for (const device of newDevices) {
      if (!markers.has(device.id)) {
        const deviceMarker = new ymaps.Placemark(
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
            iconContentLayout: ymaps.templateLayoutFactory.createClass(
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
        myMap.geoObjects.add(deviceMarker)
        markers.set(device.id, deviceMarker)
      }
    }

    const bounds = calculateDeviceBounds(newDevices)
    if (bounds)
      myMap.setBounds(bounds, {
        duration: 500,
      })
  }
})
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
