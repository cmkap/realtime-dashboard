import React, { createContext, useEffect, useState } from "react";
import type { RegionStats } from "@realtime/shared";

export interface DataContextType {
  regions: RegionStats[];
  connected: boolean;
}

export const DataContext = createContext<DataContextType>({
  regions: [],
  connected: false,
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regions, setRegions] = useState<RegionStats[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("WS connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // backend sends { type: "initial" | "update", regions: RegionStats[] }
        if (msg.type === "initial" || msg.type === "update") {
          setRegions(msg.regions ?? []);
        }
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    ws.onclose = () => {
      console.log("WS closed");
      setConnected(false);
    };
    ws.onerror = (err) => {
      console.error("WS error", err);
      setConnected(false);
    };

    return () => ws.close();
  }, []);

  return <DataContext.Provider value={{ regions, connected }}>{children}</DataContext.Provider>;
};
