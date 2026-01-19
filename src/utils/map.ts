import type ymaps from 'yandex-maps'
const API_KEY = import.meta.env.VITE_YMAP_API_KEY

import type { DeviceMap } from '@/types/device'

export const calculateDeviceBounds = (devices: DeviceMap[]) => {
  if (!devices.length) return null

  const lats = devices.map((d) => d.lat)
  const lons = devices.map((d) => d.lon)

  return [
    [Math.min(...lats), Math.min(...lons)],
    [Math.max(...lats), Math.max(...lons)],
  ]
}

export const loadYmaps = (): Promise<typeof ymaps> => {
  return new Promise((resolve, reject) => {
    if (window.ymaps) {
      resolve(window.ymaps)
      return
    }

    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`
    script.async = true

    script.onload = () => {
      window.ymaps.ready(() => {
        resolve(window.ymaps)
      })
    }

    script.onerror = () => {
      reject(new Error('Не удалось загрузить Яндекс Карты'))
    }

    document.head.appendChild(script)
  })
}
