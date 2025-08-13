import express from 'express'
import { WebSocketServer } from 'ws'
import fetch from 'node-fetch'
import type { ExtendedDataPoint, RegionStats } from '@realtime/shared'

const app = express()
const port = process.env.PORT || 3000

const endpoints = [
  {
    host: 'https://data--us-east.upscope.io/status?stats=1',
    region: 'us-east',
  },
  {
    host: 'https://data--eu-west.upscope.io/status?stats=1',
    region: 'eu-west',
  },
  {
    host: 'https://data--eu-central.upscope.io/status?stats=1',
    region: 'eu-central',
  },
  {
    host: 'https://data--us-west.upscope.io/status?stats=1',
    region: 'us-west',
  },
  {
    host: 'https://data--sa-east.upscope.io/status?stats=1',
    region: 'sa-east',
  },
  {
    host: 'https://data--ap-southeast.upscope.io/status?stats=1',
    region: 'ap-southeast',
  },
]

const regions: RegionStats[] = []

function calculateSummary(dataPoints: ExtendedDataPoint[]) {
  const count = dataPoints.length || 1
  return {
    avgCpuLoad: dataPoints.reduce((sum, p) => sum + p.cpuLoad, 0) / count,
    avgWaitTime: dataPoints.reduce((sum, p) => sum + p.waitTime, 0) / count,
    avgActiveConnections:
      dataPoints.reduce((sum, p) => sum + p.activeConnections, 0) / count,
  }
}

function updateRegionStats(region: string, point: ExtendedDataPoint) {
  let regionEntry = regions.find((r) => r.region === region)
  if (!regionEntry) {
    regionEntry = {
      region,
      dataPoints: [],
      summary: { avgCpuLoad: 0, avgWaitTime: 0, avgActiveConnections: 0 },
    }
    regions.push(regionEntry)
  }

  regionEntry.dataPoints.push(point)

  if (regionEntry.dataPoints.length > 50) {
    regionEntry.dataPoints.shift()
  }

  regionEntry.summary = calculateSummary(regionEntry.dataPoints)
}

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

const wss = new WebSocketServer({ server })

function extractMetrics(json: any, region: string): ExtendedDataPoint {
  const now = new Date().toISOString()

  return {
    timestamp: now,
    region,
    cpuLoad: json?.results?.stats?.server?.cpu_load ?? 0,
    waitTime: json?.results?.stats?.server?.wait_time ?? 0,
    activeConnections: json?.results?.stats?.server?.active_connections ?? 0,
    onlineUsers: json?.results?.stats?.online ?? 0,
    sessions: json?.results?.stats?.session ?? 0,
    timers: json?.results?.stats?.server?.timers ?? 0,
    redisUp: json?.results?.services?.redis ?? false,
    databaseUp: json?.results?.services?.database ?? false,
    status: json?.status ?? 'unknown',
  }
}

async function pollEndpoints() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint.host)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)

      const json = await res.json()
      const point = extractMetrics(json, endpoint.region)
      updateRegionStats(endpoint.region, point)
    } catch (err) {
      console.error(`Failed to fetch ${endpoint.region}:`, err)
      updateRegionStats(endpoint.region, {
        timestamp: new Date().toISOString(),
        region: endpoint.region,
        cpuLoad: 0,
        waitTime: 0,
        activeConnections: 0,
        onlineUsers: 0,
        sessions: 0,
        timers: 0,
        redisUp: false,
        databaseUp: false,
        status: 'error',
      })
    }
  }

  const message = JSON.stringify({ type: 'update', regions })
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

setInterval(pollEndpoints, 15000)
pollEndpoints()

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.send(JSON.stringify({ type: 'initial', regions }))

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})
