import { EndpointDataDetailed } from './types'
export declare function extractMetrics(data: EndpointDataDetailed): {
  cpuLoad: number
  waitTime: number
  activeConnections: number
  onlineUsers: number
  sessions: number
  timers: number
  redisUp: boolean
  databaseUp: boolean
  status: string
}
