"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);

interface MapMarker {
  id: string;
  position: [number, number];
  type: "semaforo" | "vehiculo" | "lugar" | "alarma";
  name: string;
  status?: "active" | "warning" | "critical" | "inactive";
  details?: string;
}

interface MiningMapProps {
  title?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  delay?: number;
  showLegend?: boolean;
}

export function MiningMap({
  title = "Mapa de Operaciones",
  center = [-8.0833, -77.5833], // Mina Poderosa, La Libertad, Peru
  zoom = 13,
  markers = [],
  height = "400px",
  delay = 0,
  showLegend = true,
}: MiningMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fix for default marker icons
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      setLeafletLoaded(true);
    });
  }, []);

  const getMarkerColor = (type: MapMarker["type"], status?: MapMarker["status"]) => {
    if (status === "critical") return "#ef4444";
    if (status === "warning") return "#fbbf24";
    if (status === "active") return "#10b981";
    
    switch (type) {
      case "semaforo":
        return "#fbbf24";
      case "vehiculo":
        return "#3b82f6";
      case "lugar":
        return "#8b5cf6";
      case "alarma":
        return "#ef4444";
      default:
        return "#94a3b8";
    }
  };

  const legendItems = [
    { type: "semaforo", label: "Semáforos", color: "#fbbf24" },
    { type: "vehiculo", label: "Vehículos", color: "#3b82f6" },
    { type: "lugar", label: "Lugares", color: "#8b5cf6" },
    { type: "alarma", label: "Alarmas", color: "#ef4444" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="bg-card border-border/50 overflow-hidden">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {showLegend && (
            <div className="flex items-center gap-3">
              {legendItems.map((item) => (
                <div key={item.type} className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height }} className="relative">
            {isClient && leafletLoaded ? (
              <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) => (
                  <Circle
                    key={marker.id}
                    center={marker.position}
                    radius={50}
                    pathOptions={{
                      color: getMarkerColor(marker.type, marker.status),
                      fillColor: getMarkerColor(marker.type, marker.status),
                      fillOpacity: 0.3,
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold text-gray-900">
                          {marker.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs"
                          style={{
                            borderColor: getMarkerColor(marker.type, marker.status),
                            color: getMarkerColor(marker.type, marker.status),
                          }}
                        >
                          {marker.type}
                        </Badge>
                        {marker.details && (
                          <p className="mt-2 text-sm text-gray-600">
                            {marker.details}
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Circle>
                ))}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full bg-muted/20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Cargando mapa...
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
