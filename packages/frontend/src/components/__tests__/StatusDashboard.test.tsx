global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatusDashboard } from '../StatusDashboard'
import { DataContext } from '../../context/DataContext'

const mockRegions = [
  {
    region: 'us-east-1',
    summary: {
      avgCpuLoad: 0.3,
      avgWaitTime: 120,
      avgActiveConnections: 15,
    },
    dataPoints: [],
  },
]

describe('StatusDashboard', () => {
  it('shows connected status and region buttons', () => {
    render(
      <DataContext.Provider value={{ regions: mockRegions, connected: true }}>
        <StatusDashboard />
      </DataContext.Provider>,
    )

    const connectedElements = screen.getAllByText(/connected/i)
    expect(connectedElements.length).toBeGreaterThan(0)

    // Region button
    expect(
      screen.getByRole('button', { name: /us-east-1/i }),
    ).toBeInTheDocument()
  })
})
