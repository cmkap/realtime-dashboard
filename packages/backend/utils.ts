import type { ExtendedDataPoint } from '@realtime/shared'

export function extractMetrics(json: any, region: string): ExtendedDataPoint {
  return {
    timestamp: new Date().toISOString(),
    region,
    cpuLoad: json.results.stats.server.cpu_load,
    waitTime: json.results.stats.server.wait_time,
    activeConnections: json.results.stats.server.active_connections,
    onlineUsers: json.results.stats.online,
    sessions: json.results.stats.session,
    timers: json.results.stats.server.timers,
    redisUp: json.results.services.redis,
    databaseUp: json.results.services.database,
    status: json.status,
  }
}
