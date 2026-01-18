import { type Device } from './device'

export type Group = {
  id: string
  name: string
  deviceIds: number[]

  isOpen: boolean
  devices: Device[]
}
