import type { DeviceMap } from '@/types/device'

export const calculateDeviceBounds = (devices: DeviceMap[], padding = 0.1) => {
  if (!devices.length) return null

  const lats = devices.map((d) => d.lat)
  const lons = devices.map((d) => d.lon)

  return [
    [Math.min(...lats) - padding, Math.min(...lons)],
    [Math.max(...lats) + padding, Math.max(...lons)],
  ]
}
