export interface EndpointStats {
  status?: string
  uptime: number
  requests: number
  errors: number
  lastUpdated?: string
}

export interface EndpointData {
  host: string
  region: string
  stats: EndpointStats
}

export interface DataContextType {
  data: Record<string, EndpointData | null>  
  connected: boolean
}

export interface WorkerDetail {
  wait_time: number
  workers: number
  waiting: number
  idle: number
  time_to_return?: number
  recently_blocked_keys?: [string, number, string][]
  top_keys?: [string, number][]
}

export type WorkerEntry = [string, WorkerDetail]

export interface ServerStats {
  cpus: number
  active_connections: number
  wait_time: number
  workers: WorkerEntry[]
  cpu_load: number
  timers: number
}

export interface Stats {
  servers_count: number
  online: number
  session: number
  server: ServerStats
}

export interface Services {
  database: boolean
  redis: boolean
}

export interface Results {
  services: Services
  stats: Stats
}

export interface EndpointDataDetailed {
  status: string
  region: string
  roles: string[]
  results: Results
  strict: boolean
  server_issue: string | null
  version: string
}

export interface DataPoint {
  timestamp: string; // ISO string
  latency: number; // ms
  successRate: number; // percentage 0-100
  errorCount: number; // count of errors
}

export interface RegionStats {
  region: string;
  dataPoints: DataPoint[];
}

interface RegionSummary {
  region: string;
  status: string;
  services: {
    redis: boolean;
    database: boolean;
  };
  serversCount: number;
  onlineUsers: number;
  sessions: number;
  cpuLoad: number;          // from stats.server.cpu_load
  waitTime: number;         // from stats.server.wait_time
  activeConnections: number;// from stats.server.active_connections
  timers: number;           // from stats.server.timers
  lastUpdated: string;
}



export type EndpointsDataMap = Record<string, EndpointDataDetailed | null>
