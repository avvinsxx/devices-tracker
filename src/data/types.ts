export type WsDevice = {
  id: number
  name: string
  timestamp: string
  wifi: number
  alarm: boolean
  lat: number
  lon: number
  channels: number
}

export type WsGroup = {
  id: string
  name: string
  deviceIds: number[]
}

export type WsMessage =
  | {
      type: 'groups'
      data: WsGroup[]
    }
  | {
      type: 'devices'
      data: Record<string, WsDevice>
    }
