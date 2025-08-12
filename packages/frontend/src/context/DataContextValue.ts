import type { RegionStats } from '@realtime/shared'

export interface DataContextType {
  regions: RegionStats[]
  connected: boolean
}
