"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileWarning,
  Truck,
  Users,
  Activity,
  Bell,
  Cpu,
  Mountain,
} from "lucide-react";
import { StatCard } from "@/components/cards/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { MiningMap } from "@/components/maps/mining-map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardSkeleton, ListItemSkeleton, ActivitySkeleton } from "@/components/skeletons/dashboard-skeleton";
import { 
  useMinas, 
  useDashboardResumen, 
  useAlarmas, 
  useFlota,
  useIncidentesHistorico,
  useAlarmasPorSeveridad,
  useTrabajadores,
  useIncidentes,
} from "@/hooks/use-dashboard";

// Coordenadas de Mina Poderosa, La Libertad, Peru
const MINA_COORDS = { lat: -8.0833, lng: -77.5833 };

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
  const { data: minas, isLoading: loadingMinas } = useMinas();
  
  // Derive selectedMina from minas data instead of using useEffect
  const defaultMinaId = useMemo(() => {
    return minas && minas.length > 0 ? minas[0].id_mina : null;
  }, [minas]);
  
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const activeMinaId = selectedMina ?? defaultMinaId;
  
  const { data: resumen, isLoading: loadingResumen } = useDashboardResumen(activeMinaId);
  const { data: alarmas, isLoading: loadingAlarmas } = useAlarmas(activeMinaId);
  const { data: flota, isLoading: loadingFlota } = useFlota(activeMinaId);
  const { data: incidentesHistorico } = useIncidentesHistorico(activeMinaId);
  const { data: alarmasSeveridad } = useAlarmasPorSeveridad(activeMinaId);
  const { data: trabajadores } = useTrabajadores();
  const { data: incidentes } = useIncidentes(activeMinaId);

  const minaActual = minas?.find(m => m.id_mina === activeMinaId);
  const isLoading = loadingMinas || loadingResumen;
  
  // Datos para gráficos con datos reales
  const chartIncidentes = incidentesHistorico || [
    { fecha: "Lun", incidentes: 0 },
    { fecha: "Mar", incidentes: 0 },
    { fecha: "Mie", incidentes: 0 },
    { fecha: "Jue", incidentes: 0 },
    { fecha: "Vie", incidentes: 0 },
    { fecha: "Sab", incidentes: 0 },
    { fecha: "Dom", incidentes: 0 },
  ];
  
  const chartAlarmas = alarmasSeveridad || [
    { severidad: "Critica", cantidad: 0 },
    { severidad: "Alta", cantidad: 0 },
    { severidad: "Media", cantidad: 0 },
    { severidad: "Baja", cantidad: 0 },
  ];
  
  // Calcular totales reales
  const totalTrabajadores = trabajadores?.length || 0;
  const totalIncidentes = incidentes?.length || 0;
  const incidentesHoy = incidentes?.filter(i => {
    const hoy = new Date().toDateString();
    return new Date(i.creado_en || "").toDateString() === hoy;
  }).length || 0;

  const mapMarkers = flota?.slice(0, 5).map((f, i) => ({
    id: String(f.id_flota),
    position: [MINA_COORDS.lat + (i * 0.001), MINA_COORDS.lng + (i * 0.001)] as [number, number],
    type: "vehiculo" as const,
    name: f.nombre,
    status: "active" as const,
    details: `${f.familia} - ${f.marca || "N/A"}`,
  })) || [];

  const alarmasRecientes = alarmas?.slice(0, 5) || [];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard - SafetyOps Center</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Selecciona una mina"} - {minaActual?.ubicacion || ""} | Centro de Control
          </p>
        </div>
        <Select
          value={activeMinaId?.toString() || ""}
          onValueChange={(value) => setSelectedMina(Number(value))}
        >
          <SelectTrigger className="w-full md:w-[280px] bg-card border-border/50">
            <Mountain className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="Seleccionar mina" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {minas?.map((mina) => (
              <SelectItem key={mina.id_mina} value={mina.id_mina.toString()}>
                {mina.nombre} - {mina.ubicacion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incidentes Hoy"
          value={incidentesHoy || resumen?.incidentes_hoy || 0}
          description={`${totalIncidentes} total registrados`}
          icon={FileWarning}
          variant="warning"
          delay={0}
        />
        <StatCard
          title="Alarmas Activas"
          value={alarmas?.length || resumen?.alarmas_criticas || 0}
          description={`${chartAlarmas.find(a => a.severidad === "Critica")?.cantidad || 0} críticas`}
          icon={AlertTriangle}
          variant="critical"
          delay={0.1}
        />
        <StatCard
          title="Flota Activa"
          value={flota?.length || resumen?.flota_activa || 0}
          description="Unidades operativas"
          icon={Truck}
          variant="success"
          delay={0.2}
        />
        <StatCard
          title="Trabajadores"
          value={totalTrabajadores || resumen?.trabajadores_turno || 0}
          description="Registrados en sistema"
          icon={Users}
          variant="info"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Incidentes - Últimos 7 días"
          data={chartIncidentes}
          lines={[{ dataKey: "incidentes", name: "Incidentes", color: "#fbbf24" }]}
          xAxisKey="fecha"
          delay={0.4}
        />
        <BarChart
          title="Alarmas por Severidad"
          data={chartAlarmas.map(a => ({ categoria: a.severidad, cantidad: a.cantidad }))}
          bars={[{ dataKey: "cantidad", name: "Cantidad", color: "#ef4444" }]}
          xAxisKey="categoria"
          colorByValue
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MiningMap
            title="Mapa de Operaciones"
            markers={mapMarkers}
            height="400px"
            delay={0.6}
          />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.7 }}>
          <Card className="bg-card border-border/50 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Flota Activa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[340px]">
                <div className="space-y-3">
                  {loadingFlota ? (
                    [...Array(4)].map((_, i) => <ActivitySkeleton key={i} />)
                  ) : flota && flota.length > 0 ? (
                    flota.slice(0, 6).map((item, index) => (
                      <motion.div
                        key={item.id_flota}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Truck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.nombre}</p>
                            <p className="text-xs text-muted-foreground">{item.familia}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">{item.marca || "N/A"}</p>
                          <p className="text-xs text-muted-foreground">{item.modelo || ""}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Sin datos de flota</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-500" />
                Ultimas Alarmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loadingAlarmas ? (
                  [...Array(3)].map((_, i) => <ListItemSkeleton key={i} />)
                ) : alarmasRecientes.length > 0 ? (
                  alarmasRecientes.map((alarma, index) => (
                    <motion.div
                      key={alarma.id_alarma}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="mt-0.5">
                        <Badge variant="outline" className={getSeverityColor(alarma.severidad)}>
                          {alarma.severidad}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alarma.mensaje || "Alarma detectada"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Valor: {alarma.valor_detectado ?? "N/A"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(alarma.ts_inicio).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Sin alarmas recientes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.9 }}>
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                Resumen de Operacion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <p className="text-3xl font-bold text-primary">{resumen?.flota_activa ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Vehiculos Activos</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <p className="text-3xl font-bold text-emerald-400">{resumen?.trabajadores_turno ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Personal en Turno</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Estado General</span>
                    <Badge className={resumen?.alarmas_criticas === 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>
                      {resumen?.alarmas_criticas === 0 ? "Normal" : "Atencion"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {minaActual?.empresa || "Mina Poderosa S.A."} - Operacion continua 24/7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
