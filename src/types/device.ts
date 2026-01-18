import { type Channel } from './channel'

export type Device = {
  id: number
  name: string
  timestamp: string
  wifi: number
  alarm: boolean
  lat: number
  lon: number

  isOpen: boolean
  selected: boolean
  channels: Channel[]
}

export type DeviceMap = {
  id: number
  name: string
  timestamp: string
  wifi: number
  alarm: boolean
  lat: number
  lon: number
  channels: number
}
