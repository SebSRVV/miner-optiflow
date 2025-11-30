"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileWarning,
  Truck,
  Users,
  Activity,
  Bell,
  Cpu,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { MiningMap } from "@/components/maps/mining-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Datos de Mina Poderosa - La Libertad, Peru
const incidentesData = [
  { fecha: "01 Nov", incidentes: 1 },
  { fecha: "05 Nov", incidentes: 2 },
  { fecha: "10 Nov", incidentes: 0 },
  { fecha: "15 Nov", incidentes: 1 },
  { fecha: "20 Nov", incidentes: 3 },
  { fecha: "25 Nov", incidentes: 1 },
  { fecha: "30 Nov", incidentes: 0 },
];

const alarmasCategoria = [
  { categoria: "Velocidad", cantidad: 38 },
  { categoria: "Proximidad", cantidad: 25 },
  { categoria: "Gases", cantidad: 15 },
  { categoria: "Fatiga", cantidad: 10 },
  { categoria: "Ventilacion", cantidad: 7 },
];

// Coordenadas aproximadas de Mina Poderosa, La Libertad, Peru
const mapMarkers = [
  {
    id: "1",
    position: [-8.0833, -77.5833] as [number, number],
    type: "semaforo" as const,
    name: "Semaforo Rampa Principal",
    status: "active" as const,
    details: "Estado: Verde | Nivel 2000",
  },
  {
    id: "2",
    position: [-8.0843, -77.5823] as [number, number],
    type: "vehiculo" as const,
    name: "SC-003",
    status: "active" as const,
    details: "Velocidad: 18 km/h | Op: C. Mendoza",
  },
  {
    id: "3",
    position: [-8.0823, -77.5843] as [number, number],
    type: "lugar" as const,
    name: "Estacion de Carguio",
    details: "Nivel 1800 - Zona activa",
  },
  {
    id: "4",
    position: [-8.0853, -77.5813] as [number, number],
    type: "alarma" as const,
    name: "Alerta Activa",
    status: "critical" as const,
    details: "Proximidad detectada en cruce",
  },
];

const ultimosIncidentes = [
  {
    id: 1,
    tipo: "Cuasi accidente",
    severidad: "media",
    descripcion: "Scooptram SC-005 freno de emergencia en Nivel 1800",
    tiempo: "Hace 2 horas",
  },
  {
    id: 2,
    tipo: "Falla equipo",
    severidad: "baja",
    descripcion: "Sensor de gases GAS-015 requiere calibracion",
    tiempo: "Hace 4 horas",
  },
  {
    id: 3,
    tipo: "Incidente menor",
    severidad: "alta",
    descripcion: "Desprendimiento de roca en Galeria 4",
    tiempo: "Hace 6 horas",
  },
];

const ultimasAlarmas = [
  {
    id: 1,
    tipo: "Velocidad",
    severidad: "critica",
    mensaje: "SC-003 excede limite en Rampa Principal",
    tiempo: "Hace 5 min",
  },
  {
    id: 2,
    tipo: "Proximidad",
    severidad: "alta",
    mensaje: "Vehiculos cercanos en Cruce Nivel 2000",
    tiempo: "Hace 15 min",
  },
  {
    id: 3,
    tipo: "Ventilacion",
    severidad: "media",
    mensaje: "Flujo bajo en Galeria 3",
    tiempo: "Hace 30 min",
  },
];

const actividadSensores = [
  { id: 1, sensor: "GPS-001", tipo: "Ubicacion", valor: "Nivel 2000", tiempo: "Hace 1 min" },
  { id: 2, sensor: "VEL-003", tipo: "Velocidad", valor: "18 km/h", tiempo: "Hace 2 min" },
  { id: 3, sensor: "GAS-008", tipo: "CO2", valor: "0.03%", tiempo: "Hace 3 min" },
  { id: 4, sensor: "SEM-001", tipo: "Semaforo", valor: "Verde", tiempo: "Hace 5 min" },
];

const getSeverityColor = (severidad: string) => {
  switch (severidad) {
    case "critica":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "alta":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "media":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "baja":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard - SafetyOps Center</h1>
        <p className="text-muted-foreground mt-1">
          Mina Poderosa - La Libertad, Peru | Centro de Control de Seguridad
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incidentes Hoy"
          value={3}
          description="2 menos que ayer"
          icon={FileWarning}
          variant="warning"
          trend={{ value: 40, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Alarmas Críticas"
          value={7}
          description="Requieren atención inmediata"
          icon={AlertTriangle}
          variant="critical"
          delay={0.1}
        />
        <StatCard
          title="Flota Activa"
          value="18/22"
          description="82% de la flota operativa"
          icon={Truck}
          variant="success"
          delay={0.2}
        />
        <StatCard
          title="Trabajadores en Turno"
          value={285}
          description="Guardia A - Turno Dia"
          icon={Users}
          variant="info"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Incidentes - Últimos 30 días"
          data={incidentesData}
          lines={[
            { dataKey: "incidentes", name: "Incidentes", color: "#fbbf24" },
          ]}
          xAxisKey="fecha"
          delay={0.4}
        />
        <BarChart
          title="Alarmas por Categoría"
          data={alarmasCategoria}
          bars={[
            { dataKey: "cantidad", name: "Cantidad", color: "#ef4444" },
          ]}
          xAxisKey="categoria"
          colorByValue
          delay={0.5}
        />
      </div>

      {/* Map and Activity Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - Takes 2 columns */}
        <div className="lg:col-span-2">
          <MiningMap
            title="Mapa de Operaciones en Tiempo Real"
            markers={mapMarkers}
            height="400px"
            delay={0.6}
          />
        </div>

        {/* Activity Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="bg-card border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Actividad de Sensores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[340px]">
                <div className="space-y-3">
                  {actividadSensores.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Cpu className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.sensor}</p>
                          <p className="text-xs text-muted-foreground">{item.tipo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{item.valor}</p>
                        <p className="text-xs text-muted-foreground">{item.tiempo}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Panels - Incidents and Alarms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileWarning className="h-5 w-5 text-yellow-500" />
                Últimos Incidentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ultimosIncidentes.map((incidente, index) => (
                  <motion.div
                    key={incidente.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={getSeverityColor(incidente.severidad)}
                      >
                        {incidente.severidad}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{incidente.tipo}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {incidente.descripcion}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {incidente.tiempo}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alarms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-500" />
                Últimas Alarmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ultimasAlarmas.map((alarma, index) => (
                  <motion.div
                    key={alarma.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="mt-0.5">
                      <Badge
                        variant="outline"
                        className={getSeverityColor(alarma.severidad)}
                      >
                        {alarma.tipo}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alarma.mensaje}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {alarma.tiempo}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
