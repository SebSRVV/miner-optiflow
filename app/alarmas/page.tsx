"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Search,
  Bell,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw,
  Loader2,
  Mountain,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/cards/stat-card";
import { useMinas, useAlarmas, useCrearAlarma } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";
import { SeveridadAlarma } from "@/lib/rpc/alarmas";

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

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "velocidad":
      return "🚗";
    case "proximidad":
      return "📡";
    case "zona_restringida":
      return "⛔";
    case "fatiga":
      return "😴";
    default:
      return "⚠️";
  }
};

export default function AlarmasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const [filterSeveridad, setFilterSeveridad] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    severidad: "" as SeveridadAlarma,
    mensaje: "",
    valor_detectado: "",
  });

  const { toast } = useToast();
  const { data: minas, isLoading: loadingMinas } = useMinas();
  const { data: alarmas, isLoading: loadingAlarmas, refetch, isFetching } = useAlarmas(selectedMina);
  const crearAlarmaMutation = useCrearAlarma();

  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }

  const filteredAlarmas = (alarmas || []).filter((alarma) => {
    const matchesSearch = alarma.mensaje?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeveridad = filterSeveridad === "all" || alarma.severidad === filterSeveridad;
    return matchesSearch && matchesSeveridad;
  });

  const stats = {
    total: alarmas?.length || 0,
    criticas: alarmas?.filter((a) => a.severidad === "critica").length || 0,
    altas: alarmas?.filter((a) => a.severidad === "alta").length || 0,
    medias: alarmas?.filter((a) => a.severidad === "media").length || 0,
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando alarmas desde Supabase...",
    });
  };

  const handleCreateAlarma = async () => {
    if (!selectedMina || !formData.severidad || !formData.mensaje) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearAlarmaMutation.mutateAsync({
        id_mina: selectedMina,
        severidad: formData.severidad,
        mensaje: formData.mensaje,
        valor_detectado: formData.valor_detectado ? parseFloat(formData.valor_detectado) : undefined,
      });
      toast({
        title: "Alarma creada",
        description: "La alarma se ha registrado correctamente",
      });
      setIsCreateDialogOpen(false);
      setFormData({ severidad: "" as SeveridadAlarma, mensaje: "", valor_detectado: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la alarma",
        variant: "destructive",
      });
    }
  };

  const minaActual = minas?.find((m) => m.id_mina === selectedMina);

  // Loading
  if (loadingMinas) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Alarmas</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Selecciona una mina"} - Sistema de alertas en tiempo real
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90" disabled={!selectedMina}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Alarma
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Registrar Nueva Alarma</DialogTitle>
                <DialogDescription>
                  Crea una nueva alarma para la mina {minaActual?.nombre}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="severidad">Severidad *</Label>
                  <Select
                    value={formData.severidad}
                    onValueChange={(v) => setFormData({ ...formData, severidad: v as SeveridadAlarma })}
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar severidad" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="baja">Baja</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mensaje">Mensaje *</Label>
                  <Textarea
                    id="mensaje"
                    placeholder="Descripción de la alarma..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor Detectado (opcional)</Label>
                  <Input
                    id="valor"
                    type="number"
                    placeholder="Ej: 85.5"
                    value={formData.valor_detectado}
                    onChange={(e) => setFormData({ ...formData, valor_detectado: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateAlarma} disabled={crearAlarmaMutation.isPending}>
                  {crearAlarmaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Alarma"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Alarmas"
          value={stats.total}
          icon={Bell}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Críticas"
          value={stats.criticas}
          icon={AlertTriangle}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Altas"
          value={stats.altas}
          icon={Clock}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Medias"
          value={stats.medias}
          icon={CheckCircle}
          trend={{ value: 0, isPositive: true }}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar alarmas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
        <Select value={filterSeveridad} onValueChange={setFilterSeveridad}>
          <SelectTrigger className="w-[180px] bg-card border-border/50">
            <SelectValue placeholder="Severidad" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="critica">Críticas</SelectItem>
            <SelectItem value="alta">Altas</SelectItem>
            <SelectItem value="media">Medias</SelectItem>
            <SelectItem value="baja">Bajas</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* No mina selected */}
      {!selectedMina && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Mountain className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">Selecciona una mina</h2>
          <p className="text-muted-foreground">Elige una mina para ver sus alarmas</p>
        </div>
      )}

      {/* Loading alarmas */}
      {selectedMina && loadingAlarmas && (
        <Card className="bg-card border-border/50">
          <CardContent className="p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3">Cargando alarmas...</span>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {selectedMina && !loadingAlarmas && filteredAlarmas.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Bell className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay alarmas</h2>
          <p className="text-muted-foreground">
            {searchQuery || filterSeveridad !== "all"
              ? "No se encontraron alarmas con ese criterio"
              : "No hay alarmas registradas para esta mina"}
          </p>
        </div>
      )}

      {/* Table */}
      {selectedMina && !loadingAlarmas && filteredAlarmas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Alarmas Recientes ({filteredAlarmas.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Tipo</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlarmas.map((alarma) => (
                    <TableRow key={alarma.id_alarma} className="border-border/50">
                      <TableCell>
                        <span className="text-lg mr-2">⚠️</span>
                        <span className="capitalize">Alarma #{alarma.id_alarma}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(alarma.severidad)}>
                          {alarma.severidad}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {alarma.mensaje || "Sin mensaje"}
                      </TableCell>
                      <TableCell>
                        {alarma.valor_detectado !== null ? (
                          <span className="font-mono">{alarma.valor_detectado}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {alarma.ts_inicio
                          ? new Date(alarma.ts_inicio).toLocaleString("es-PE")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Fetching indicator */}
      {isFetching && !loadingAlarmas && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">Actualizando...</span>
        </div>
      )}
    </div>
  );
}
