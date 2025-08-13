import { describe, it, expect } from 'vitest'
import { extractMetrics } from '../../utils'

describe('extractMetrics', () => {
  it('should extract correct fields from API JSON', () => {
    const json = {
      status: 'ok',
      results: {
        stats: {
          server: {
            cpu_load: 0.5,
            wait_time: 100,
            active_connections: 5,
            timers: 10,
          },
          online: 50,
          session: 2,
        },
        services: { redis: true, database: false },
      },
    }

    const region = 'test-region'
    const result = extractMetrics(json, region)

    expect(result.region).toBe(region)
    expect(result.cpuLoad).toBe(0.5)
    expect(result.redisUp).toBe(true)
    expect(result.databaseUp).toBe(false)
    expect(result.onlineUsers).toBe(50)
  })
})
