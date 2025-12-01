"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  AlertTriangle,
  Truck,
  FileWarning,
  Mountain,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/cards/stat-card";
import { LineChart } from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  useMinas, 
  useAlarmas, 
  useFlota, 
  useIncidentes, 
  useDashboardResumen,
  useTrabajadores,
  useIncidentesHistorico,
  useAlarmasPorSeveridad,
} from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";

export default function MetricsPage() {
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const { toast } = useToast();
  
  const { data: minas } = useMinas();
  const { data: alarmas, refetch: refetchAlarmas, isFetching } = useAlarmas(selectedMina);
  const { data: flota } = useFlota(selectedMina);
  const { data: incidentes } = useIncidentes(selectedMina);
  const { data: resumen } = useDashboardResumen(selectedMina);
  const { data: trabajadores } = useTrabajadores();
  const { data: incidentesHistorico } = useIncidentesHistorico(selectedMina);
  const { data: alarmasSeveridad } = useAlarmasPorSeveridad(selectedMina);
  
  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }
  
  const minaActual = minas?.find((m) => m.id_mina === selectedMina);
  
  // Calcular KPIs reales
  const realKpis = {
    incidentesTotal: incidentes?.length || 0,
    alarmasCriticas: alarmas?.filter((a) => a.severidad === "critica").length || 0,
    alarmasTotal: alarmas?.length || 0,
    flotaActiva: flota?.length || 0,
    flotaTotal: flota?.length || 0,
    trabajadores: trabajadores?.length || 0,
  };
  
  // Datos para gráficos con datos reales
  const tendenciaIncidentes = incidentesHistorico || [
    { fecha: "Lun", incidentes: 0 },
    { fecha: "Mar", incidentes: 0 },
    { fecha: "Mie", incidentes: 0 },
    { fecha: "Jue", incidentes: 0 },
    { fecha: "Vie", incidentes: 0 },
    { fecha: "Sab", incidentes: 0 },
    { fecha: "Dom", incidentes: 0 },
  ];
  
  const distribucionAlarmas = alarmasSeveridad?.map(a => ({
    tipo: a.severidad,
    cantidad: a.cantidad,
  })) || [
    { tipo: "Critica", cantidad: 0 },
    { tipo: "Alta", cantidad: 0 },
    { tipo: "Media", cantidad: 0 },
    { tipo: "Baja", cantidad: 0 },
  ];
  
  // Comparativa de minas (usando datos reales de todas las minas)
  const comparativaMinas = (minas || []).slice(0, 3).map(mina => ({
    mina: mina.nombre,
    incidentes: incidentes?.filter(i => i.id_mina === mina.id_mina).length || 0,
    alarmas: alarmas?.length || 0,
    flota: flota?.length || 0,
    trabajadores: realKpis.trabajadores,
  }));
  
  const handleRefresh = () => {
    refetchAlarmas();
    toast({
      title: "Actualizando",
      description: "Cargando métricas desde Supabase...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Métricas</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Selecciona una mina"} - Análisis y estadísticas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedMina?.toString() || ""}
            onValueChange={(v) => setSelectedMina(parseInt(v))}
          >
            <SelectTrigger className="w-[200px] bg-card border-border/50">
              <Mountain className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Seleccionar mina" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {(minas || []).map((mina) => (
                <SelectItem key={mina.id_mina} value={mina.id_mina.toString()}>
                  {mina.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching || !selectedMina}
            className="border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </motion.div>

      {/* KPIs Globales - Datos reales de Supabase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incidentes"
          value={realKpis.incidentesTotal}
          description="Total registrados"
          icon={FileWarning}
          variant="warning"
          trend={{ value: 0, isPositive: true }}
          delay={0}
        />
        <StatCard
          title="Alarmas Críticas"
          value={realKpis.alarmasCriticas}
          description={`${realKpis.alarmasTotal} alarmas total`}
          icon={AlertTriangle}
          variant="critical"
          delay={0.1}
        />
        <StatCard
          title="Flota"
          value={realKpis.flotaActiva}
          description="Unidades registradas"
          icon={Truck}
          variant="success"
          delay={0.2}
        />
        <StatCard
          title="Dashboard"
          value={resumen ? "Activo" : "Sin datos"}
          description={minaActual?.nombre || "Selecciona mina"}
          icon={BarChart3}
          variant="info"
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Incidentes - Últimos 7 días"
          data={tendenciaIncidentes}
          lines={[{ dataKey: "incidentes", name: "Incidentes", color: "#fbbf24" }]}
          xAxisKey="fecha"
          delay={0.4}
        />
        <BarChart
          title="Alarmas por Severidad"
          data={distribucionAlarmas}
          bars={[{ dataKey: "cantidad", name: "Cantidad", color: "#ef4444" }]}
          xAxisKey="tipo"
          colorByValue
          delay={0.5}
        />
      </div>

      {/* Comparativa Minas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" />
              Comparativa entre Minas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparativaMinas.map((mina, index) => (
                <motion.div
                  key={mina.mina}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <h3 className="font-semibold text-lg mb-4">{mina.mina}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-2xl font-bold text-yellow-400">{mina.incidentes}</p>
                      <p className="text-xs text-muted-foreground">Incidentes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-400">{mina.alarmas}</p>
                      <p className="text-xs text-muted-foreground">Alarmas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-400">{mina.flota}</p>
                      <p className="text-xs text-muted-foreground">Flota</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">{mina.trabajadores}</p>
                      <p className="text-xs text-muted-foreground">Trabajadores</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resumen de Datos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas Alarmas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Últimas Alarmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(alarmas || []).slice(0, 5).map((alarma) => (
                  <div
                    key={alarma.id_alarma}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          alarma.severidad === "critica"
                            ? "bg-red-500"
                            : alarma.severidad === "alta"
                            ? "bg-orange-500"
                            : alarma.severidad === "media"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{alarma.mensaje || "Alarma detectada"}</p>
                        <p className="text-xs text-muted-foreground">
                          Valor: {alarma.valor_detectado ?? "N/A"}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={
                      alarma.severidad === "critica" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                      alarma.severidad === "alta" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                      alarma.severidad === "media" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    }>
                      {alarma.severidad}
                    </Badge>
                  </div>
                ))}
                {(!alarmas || alarmas.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">Sin alarmas registradas</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flota Registrada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Flota Registrada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Familia</TableHead>
                    <TableHead>Marca</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(flota || []).slice(0, 5).map((unidad, index) => (
                    <TableRow key={unidad.id_flota} className="border-border/50">
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{unidad.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{unidad.familia}</TableCell>
                      <TableCell className="text-muted-foreground">{unidad.marca || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                  {(!flota || flota.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                        Sin flota registrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
