import express from 'express'
import { WebSocketServer } from 'ws'
import fetch from 'node-fetch'
import type { EndpointData } from '@realtime/shared'

const app = express()
const port = process.env.PORT || 3000

const endpoints = [
  { host: 'https://data--us-east.upscope.io/status?stats=1', region: 'us-east' },
  { host: 'https://data--eu-west.upscope.io/status?stats=1', region: 'eu-west' },
  { host: 'https://data--eu-central.upscope.io/status?stats=1', region: 'eu-central' },
  { host: 'https://data--us-west.upscope.io/status?stats=1', region: 'us-west' },
  { host: 'https://data--sa-east.upscope.io/status?stats=1', region: 'sa-east' },
  { host: 'https://data--ap-southeast.upscope.io/status?stats=1', region: 'ap-southeast' },
]

interface CachedData {
  [region: string]: EndpointData | null
}

const cachedData: CachedData = {}

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

const wss = new WebSocketServer({ server })

function broadcast(data: any) {
  const message = JSON.stringify(data)
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(message)
    }
  })
}

async function pollEndpoints() {
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint.host)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)

      const data = (await res.json()) as EndpointData
      const prev = cachedData[endpoint.region] ?? null

      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        cachedData[endpoint.region] = data
        broadcast({ type: 'update', region: endpoint.region, data })
      }
    } catch (err) {
      console.error(`Failed to fetch ${endpoint.region}:`, err)
    }
  }
}

setInterval(pollEndpoints, 15000)
pollEndpoints()

wss.on('connection', ws => {
  console.log('Client connected')
  ws.send(JSON.stringify({ type: 'initialData', data: cachedData }))

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})
