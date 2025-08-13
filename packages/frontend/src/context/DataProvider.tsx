import React, { useState, useEffect } from 'react'
import { DataContext } from './DataContext'
import type { RegionStats } from '@realtime/shared'

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [regions, setRegions] = useState<RegionStats[]>([])
  const [connected, setConnected] = useState(false)

  // Use VITE_WS_URL if defined, otherwise fallback to localhost dev port
  const WS_URL = import.meta.env.VITE_WS_URL
    ? import.meta.env.VITE_WS_URL
    : `ws://localhost:${import.meta.env.VITE_DEV_PORT || 3000}`

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      console.log(`WebSocket connected to ${WS_URL}`)
      setConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === 'initial' || message.type === 'update') {
          setRegions(message.regions ?? [])
        }
      } catch (err) {
        console.error('Invalid WS message', err)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      setConnected(false)
    }

    ws.onerror = (err) => {
      console.error('WebSocket error', err)
      setConnected(false)
    }

    return () => ws.close()
  }, [WS_URL]) // re-create if WS_URL changes (rare in prod)

  return (
    <DataContext.Provider value={{ regions, connected }}>
      {children}
    </DataContext.Provider>
  )
}
