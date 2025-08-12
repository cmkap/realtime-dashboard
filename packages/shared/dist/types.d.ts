export interface EndpointStats {
    status: string;
    uptime: number;
    requests: number;
    errors: number;
    lastUpdated: string;
}
export interface EndpointData {
    host: string;
    region: string;
    stats: EndpointStats;
}
