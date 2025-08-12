import React, { useState, useEffect } from 'react'
import { DataContext } from './DataContext'
import type { RegionStats } from '@realtime/shared'

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regions, setRegions] = useState<RegionStats[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000')

    ws.onopen = () => setConnected(true)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'initial' || message.type === 'update') {
        setRegions(message.regions)
      }
    }

    ws.onclose = () => setConnected(false)
    ws.onerror = () => setConnected(false)

    return () => ws.close()
  }, [])

  return <DataContext.Provider value={{ regions, connected }}>{children}</DataContext.Provider>
}
