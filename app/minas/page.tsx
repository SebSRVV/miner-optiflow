"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mountain,
  Plus,
  Search,
  MapPin,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Loader2,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMinas, useCrearMina } from "@/hooks/use-dashboard";
import { useToast } from "@/hooks/use-toast";

export default function MinasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    ubicacion: "",
    empresa: "",
  });

  const { toast } = useToast();
  const { data: minas, isLoading, error, refetch, isFetching } = useMinas();
  const crearMinaMutation = useCrearMina();

  const filteredMinas = (minas || []).filter(
    (mina) =>
      mina.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mina.ubicacion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMina = async () => {
    if (!formData.nombre || !formData.codigo || !formData.ubicacion || !formData.empresa) {
      toast({
        title: "Error",
        description: "Todos los campos son requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await crearMinaMutation.mutateAsync(formData);
      toast({
        title: "Mina creada",
        description: `La mina "${formData.nombre}" ha sido creada exitosamente`,
      });
      setIsCreateDialogOpen(false);
      setFormData({ nombre: "", codigo: "", ubicacion: "", empresa: "" });
    } catch (err) {
      toast({
        title: "Error al crear mina",
        description: err instanceof Error ? err.message : "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Actualizando",
      description: "Cargando datos desde Supabase...",
    });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border/50">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
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
        <h2 className="text-xl font-semibold">Error al cargar minas</h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error.message || "No se pudo conectar con Supabase. Verifica tu conexión."}
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
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Minas</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de faenas mineras ({minas?.length || 0} registradas)
          </p>
        </div>
        <div className="flex gap-2">
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
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Mina
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Crear Nueva Mina</DialogTitle>
                <DialogDescription>
                  Los datos se guardarán en Supabase
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Mina Poderosa"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    placeholder="MP-001"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación *</Label>
                  <Input
                    id="ubicacion"
                    placeholder="Pataz, La Libertad, Peru"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    placeholder="Compañía Minera Poderosa S.A."
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateMina}
                  disabled={crearMinaMutation.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {crearMinaMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Crear Mina"
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
            placeholder="Buscar minas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>
      </motion.div>

      {/* Empty state */}
      {filteredMinas.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
          <Mountain className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-xl font-semibold">No hay minas registradas</h2>
          <p className="text-muted-foreground text-center max-w-md">
            {searchQuery
              ? "No se encontraron minas con ese criterio de búsqueda"
              : "Crea tu primera mina para comenzar a gestionar tus operaciones"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Mina
            </Button>
          )}
        </div>
      )}

      {/* Minas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMinas.map((mina, index) => (
          <motion.div
            key={mina.id_mina}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:glow-yellow transition-all">
                      <Mountain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mina.nombre}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {mina.ubicacion}
                      </div>
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
                        <Link href={`/minas/${mina.id_mina}`} className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Código</span>
                    <Badge variant="outline">{mina.codigo}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Empresa</span>
                    <span className="text-sm font-medium truncate max-w-[150px]">{mina.empresa}</span>
                  </div>
                  <Link href={`/minas/${mina.id_mina}`}>
                    <Button
                      variant="outline"
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    >
                      Ver Detalles
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
