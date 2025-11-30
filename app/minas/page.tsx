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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Minas de Peru
const minasData = [
  {
    id: "1",
    nombre: "Mina Poderosa",
    ubicacion: "Pataz, La Libertad, Peru",
    latitud: -8.0833,
    longitud: -77.5833,
    estado: "activa",
    lugares: 12,
    flota: 18,
    trabajadores: 156,
    alarmasActivas: 2,
  },
  {
    id: "2",
    nombre: "Mina Yanacocha",
    ubicacion: "Cajamarca, Peru",
    latitud: -6.9833,
    longitud: -78.5333,
    estado: "activa",
    lugares: 15,
    flota: 24,
    trabajadores: 210,
    alarmasActivas: 1,
  },
  {
    id: "3",
    nombre: "Mina Antamina",
    ubicacion: "Ancash, Peru",
    latitud: -9.5333,
    longitud: -77.0667,
    estado: "activa",
    lugares: 10,
    flota: 20,
    trabajadores: 180,
    alarmasActivas: 0,
  },
  {
    id: "4",
    nombre: "Mina Cerro Verde",
    ubicacion: "Arequipa, Peru",
    latitud: -16.5333,
    longitud: -71.6000,
    estado: "mantenimiento",
    lugares: 8,
    flota: 12,
    trabajadores: 95,
    alarmasActivas: 0,
  },
];

const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "activa":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Activa</Badge>;
    case "inactiva":
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Inactiva</Badge>;
    case "mantenimiento":
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Mantenimiento</Badge>;
    default:
      return <Badge variant="outline">{estado}</Badge>;
  }
};

export default function MinasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredMinas = minasData.filter(
    (mina) =>
      mina.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mina.ubicacion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateMina = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsCreateDialogOpen(false);
  };

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
            Gestión de faenas mineras y sus ubicaciones
          </p>
        </div>
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
                Ingresa los datos de la nueva faena minera
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Nombre de la mina"
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  id="ubicacion"
                  placeholder="Ciudad, País"
                  className="bg-background border-border/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitud">Latitud</Label>
                  <Input
                    id="latitud"
                    type="number"
                    placeholder="-8.0833"
                    className="bg-background border-border/50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitud">Longitud</Label>
                  <Input
                    id="longitud"
                    type="number"
                    placeholder="-77.5833"
                    className="bg-background border-border/50"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select defaultValue="activa">
                  <SelectTrigger className="bg-background border-border/50">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
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
                disabled={isLoading}
                className="bg-primary text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Mina"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Minas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMinas.map((mina, index) => (
          <motion.div
            key={mina.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
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
                        <Link href={`/minas/${mina.id}`} className="flex items-center">
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
                    <span className="text-sm text-muted-foreground">Estado</span>
                    {getEstadoBadge(mina.estado)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-2xl font-bold text-foreground">{mina.lugares}</p>
                      <p className="text-xs text-muted-foreground">Lugares</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-2xl font-bold text-foreground">{mina.flota}</p>
                      <p className="text-xs text-muted-foreground">Flota</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-2xl font-bold text-foreground">{mina.trabajadores}</p>
                      <p className="text-xs text-muted-foreground">Trabajadores</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className={`text-2xl font-bold ${mina.alarmasActivas > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {mina.alarmasActivas}
                      </p>
                      <p className="text-xs text-muted-foreground">Alarmas</p>
                    </div>
                  </div>
                  <Link href={`/minas/${mina.id}`}>
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
    </div>
  );
}
