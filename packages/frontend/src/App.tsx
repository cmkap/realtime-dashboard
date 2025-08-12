import React from 'react'
import { DataProvider } from './context/DataContext'
import { StatusDashboard } from './components/StatusDashboard'

export default function App() {
  return (
    <DataProvider>
      <StatusDashboard />
    </DataProvider>
  )
}
