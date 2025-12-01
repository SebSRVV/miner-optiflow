"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CircleDot,
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Play,
  MapPin,
  Loader2,
  Circle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { useMinas, useSemaforos, useCrearSemaforo } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";
import { Mountain } from "lucide-react";
import { EstadoSemaforo } from "@/lib/rpc/semaforos";

const getEstadoIndicator = (estado: string) => {
  switch (estado) {
    case "verde":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-emerald-500 text-emerald-500" />
          <span className="text-emerald-400">Verde</span>
        </div>
      );
    case "amarillo":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="text-yellow-400">Amarillo</span>
        </div>
      );
    case "rojo":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-red-500 text-red-500" />
          <span className="text-red-400">Rojo</span>
        </div>
      );
    case "intermitente":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500 animate-pulse" />
          <span className="text-yellow-400">Intermitente</span>
        </div>
      );
    case "apagado":
      return (
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 fill-gray-500 text-gray-500" />
          <span className="text-gray-400">Apagado</span>
        </div>
      );
    default:
      return <span>{estado}</span>;
  }
};

export default function SemaforosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMina, setSelectedMina] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    estado_actual: "verde" as EstadoSemaforo,
  });

  const { toast } = useToast();
  const { data: minas } = useMinas();
  const { data: semaforos, isLoading, error, refetch, isFetching } = useSemaforos();
  const crearSemaforoMutation = useCrearSemaforo();

  // Auto-select first mina
  if (!selectedMina && minas && minas.length > 0) {
    setSelectedMina(minas[0].id_mina);
  }

  const minaActual = minas?.find((m) => m.id_mina === selectedMina);

  const handleCreateSemaforo = async () => {
    if (!formData.codigo || !formData.nombre) {
      toast({
        title: "Error",
        description: "Completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearSemaforoMutation.mutateAsync({
        codigo: formData.codigo,
        nombre: formData.nombre,
        estado_actual: formData.estado_actual,
      });
      toast({
        title: "Semáforo creado",
        description: "El semáforo se ha registrado correctamente",
      });
      setIsCreateDialogOpen(false);
      setFormData({ codigo: "", nombre: "", estado_actual: "verde" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el semáforo",
        variant: "destructive",
      });
    }
  };

  const filteredSemaforos = (semaforos || []).filter(
    (semaforo) =>
      semaforo.codigo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      semaforo.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando semáforos desde Supabase...",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold">Error al cargar semáforos</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error.message || "No se pudo conectar con Supabase"}
        </p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
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
          <h1 className="text-3xl font-bold text-foreground">Semáforos</h1>
          <p className="text-muted-foreground mt-1">
            {minaActual?.nombre || "Todas las minas"} - Control de tráfico ({filteredSemaforos.length})
          </p>
        </div>
        <div className="flex gap-2">
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
            disabled={isFetching}
            className="border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Semáforo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Semáforo</DialogTitle>
                <DialogDescription>
                  Registra un nuevo semáforo en el sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    placeholder="Ej: SEM-001"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Ej: Semáforo Cruce Principal"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado Inicial</Label>
                  <Select
                    value={formData.estado_actual}
                    onValueChange={(v) => setFormData({ ...formData, estado_actual: v as EstadoSemaforo })}
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="verde">Verde</SelectItem>
                      <SelectItem value="amarillo">Amarillo</SelectItem>
                      <SelectItem value="rojo">Rojo</SelectItem>
                      <SelectItem value="intermitente">Intermitente</SelectItem>
                      <SelectItem value="apagado">Apagado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateSemaforo} disabled={crearSemaforoMutation.isPending}>
                  {crearSemaforoMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Semáforo"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar semáforos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
      </motion.div>

      {/* Empty state */}
      {filteredSemaforos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <CircleDot className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay semáforos registrados</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {searchQuery
              ? "No se encontraron semáforos con ese criterio"
              : "Los semáforos se registran desde la base de datos"}
          </p>
        </div>
      )}

      {/* Semaforos Grid */}
      {filteredSemaforos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSemaforos.map((semaforo, index) => (
            <motion.div
              key={semaforo.id_semaforo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <CircleDot className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{semaforo.codigo || `SEM-${semaforo.id_semaforo}`}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {semaforo.nombre || "Sin nombre"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem asChild>
                          <Link href={`/semaforos/${semaforo.id_semaforo}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/semaforos/${semaforo.id_semaforo}/simulacion`}>
                            <Play className="h-4 w-4 mr-2" />
                            Simulación
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estado</span>
                      {getEstadoIndicator(semaforo.estado_actual)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Lugar</span>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {semaforo.id_lugar ? `Lugar #${semaforo.id_lugar}` : "Sin asignar"}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/semaforos/${semaforo.id_semaforo}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-primary/30 text-primary hover:bg-primary/10"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detalles
                        </Button>
                      </Link>
                      <Link href={`/semaforos/${semaforo.id_semaforo}/simulacion`}>
                        <Button
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          size="sm"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fetching indicator */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm">Actualizando...</span>
        </div>
      )}
    </div>
  );
}
