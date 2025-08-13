import React, { useEffect, useMemo, useState } from 'react'
import { useData } from '../hooks/useData'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const formatTime = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
}

export const StatusDashboard: React.FC = () => {
  const { regions, connected } = useData()

  const defaultRegion = regions.length > 0 ? regions[0].region : ''
  const [selected, setSelected] = useState<string>(defaultRegion)

  useEffect(() => {
    if (!selected && regions.length > 0) setSelected(regions[0].region)
  }, [regions, selected])

  const selectedRegion = useMemo(
    () => regions.find((r) => r.region === selected) ?? regions[0],
    [regions, selected],
  )

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-500 flex flex-col items-center px-4 py-8 w-full">
      {/* Full width container */}
      <div className="w-full">
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">
              Realtime Endpoint Status
            </h1>
            <p className="text-gray-600 text-sm">
              Live metrics across regions — CPU, wait time, connections, users.
            </p>
          </div>

          <div className="flex items-center gap-8">
            {/* Region buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {regions.map((r) => (
                <button
                  key={r.region}
                  onClick={() => setSelected(r.region)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition 
                    ${
                      r.region === selected
                        ? 'bg-indigo-600 text-gray-900 shadow-md hover:bg-indigo-700'
                        : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                    }
                  `}
                >
                  {r.region.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="grid gap-8 md:grid-cols-2">
          <section className="bg-white rounded-3xl p-6 shadow-lg flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Overview</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">
                  Connected
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    connected
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div>
                <span className="text-sm text-gray-600 font-medium">
                  Regions
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {regions.map((r) => (
                    <div
                      key={r.region}
                      className="px-3 py-1 bg-indigo-100 rounded-full text-xs font-semibold text-indigo-800"
                    >
                      {r.region.toUpperCase()} ({r.dataPoints.length})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Latest snapshot */}
          <section className="bg-white rounded-3xl p-6 shadow-lg flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Latest Snapshot</h2>
            {!selectedRegion ? (
              <p className="text-center text-gray-500">No region selected</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 text-gray-800">
                  <Metric
                    label="Avg CPU Load"
                    value={
                      ((selectedRegion.summary?.avgCpuLoad ?? 0) * 100).toFixed(
                        1,
                      ) + '%'
                    }
                  />
                  <Metric
                    label="Avg Wait (ms)"
                    value={(selectedRegion.summary?.avgWaitTime ?? 0).toFixed(
                      0,
                    )}
                  />
                  <Metric
                    label="Avg Connections"
                    value={(
                      selectedRegion.summary?.avgActiveConnections ?? 0
                    ).toFixed(0)}
                  />
                  <Metric
                    label="Latest Timestamp"
                    value={
                      selectedRegion.dataPoints.length
                        ? formatTime(
                            selectedRegion.dataPoints[
                              selectedRegion.dataPoints.length - 1
                            ].timestamp,
                          )
                        : '-'
                    }
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Latest datapoint</h3>
                  {selectedRegion.dataPoints.length ? (
                    <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(
                        selectedRegion.dataPoints[
                          selectedRegion.dataPoints.length - 1
                        ],
                        null,
                        2,
                      )}
                    </pre>
                  ) : (
                    <p className="text-sm text-gray-500">No datapoints yet</p>
                  )}
                </div>
              </>
            )}
          </section>

          {/* Chart */}
          <section className="bg-white rounded-3xl p-6 shadow-lg md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Trends — {selected?.toUpperCase() ?? '—'}
              </h2>
              <div className="text-sm text-gray-500">
                {selectedRegion
                  ? `${selectedRegion.dataPoints.length} points`
                  : ''}
              </div>
            </div>

            {selectedRegion && selectedRegion.dataPoints.length ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedRegion.dataPoints}
                    margin={{ top: 12, right: 24, left: 0, bottom: 12 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatTime}
                      stroke="#374151"
                      minTickGap={20}
                    />
                    <YAxis stroke="#374151" />
                    <Tooltip
                      wrapperStyle={{ border: 'none' }}
                      contentStyle={{ background: '#fff', borderRadius: 8 }}
                      labelFormatter={(label) =>
                        `Time: ${formatTime(label as string)}`
                      }
                    />
                    <Legend
                      wrapperStyle={{ color: '#374151' }}
                      verticalAlign="top"
                      align="right"
                      height={36}
                    />
                    <Line
                      type="monotone"
                      dataKey="cpuLoad"
                      name="CPU Load"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="waitTime"
                      name="Wait (ms)"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="activeConnections"
                      name="Connections"
                      stroke="#F97316"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="onlineUsers"
                      name="Online Users"
                      stroke="#EF4444"
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-500">
                Waiting for region data...
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

const Metric: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="bg-gray-100 p-4 rounded-xl shadow-inner text-center">
    <div className="text-sm text-gray-500 mb-1 font-medium">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
)
