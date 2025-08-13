// packages/shared/src/utils.ts
import { EndpointDataDetailed } from './types'

export function extractMetrics(data: EndpointDataDetailed) {
  return {
    cpuLoad: data.results.stats.server.cpu_load,
    waitTime: data.results.stats.server.wait_time,
    activeConnections: data.results.stats.server.active_connections,
    onlineUsers: data.results.stats.online,
    sessions: data.results.stats.session,
    timers: data.results.stats.server.timers,
    redisUp: data.results.services.redis,
    databaseUp: data.results.services.database,
    status: data.status,
  }
}
