"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mountain, ArrowLeft, Edit, MapPin, Truck, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/cards/stat-card";
import { MiningMap } from "@/components/maps/mining-map";

const minaData = {
  id: "1",
  nombre: "Mina Poderosa",
  ubicacion: "Pataz, La Libertad, Peru",
  latitud: -8.0833,
  longitud: -77.5833,
  estado: "activa",
  totalLugares: 12,
  totalFlota: 18,
  totalTrabajadores: 156,
  alarmasActivas: 2,
};

const lugaresData = [
  { id: "1", nombre: "Nivel 2000 - Santa Maria", tipo: "galeria" },
  { id: "2", nombre: "Rampa Principal", tipo: "rampa" },
  { id: "3", nombre: "Nivel 1800 - Pataz", tipo: "galeria" },
  { id: "4", nombre: "Superficie - Planta Maranon", tipo: "superficie" },
];

const flotaData = [
  { id: "1", codigo: "SC-003", tipo: "Scooptram", estado: "activo" },
  { id: "2", codigo: "SC-005", tipo: "Scooptram", estado: "activo" },
  { id: "3", codigo: "JB-002", tipo: "Jumbo", estado: "mantenimiento" },
];

const alarmasData = [
  { id: "1", tipo: "Velocidad", mensaje: "Exceso en Zona A", severidad: "alta" },
  { id: "2", tipo: "Proximidad", mensaje: "Vehiculos cercanos", severidad: "media" },
];

export default function MinaDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("lugares");

  const mapMarkers = [
    {
      id: "mina",
      position: [minaData.latitud, minaData.longitud] as [number, number],
      type: "lugar" as const,
      name: minaData.nombre,
      status: "active" as const,
      details: minaData.ubicacion,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/minas">
          <Button variant="ghost" className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Minas
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 glow-yellow">
              <Mountain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{minaData.nombre}</h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {minaData.ubicacion}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">{minaData.estado}</Badge>
            <Button variant="outline" className="border-border/50"><Edit className="h-4 w-4 mr-2" />Editar</Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Lugares" value={minaData.totalLugares} icon={MapPin} variant="default" />
        <StatCard title="Flota" value={minaData.totalFlota} icon={Truck} variant="info" />
        <StatCard title="Trabajadores" value={minaData.totalTrabajadores} icon={Users} variant="success" />
        <StatCard title="Alarmas Activas" value={minaData.alarmasActivas} icon={AlertTriangle} variant="warning" />
      </div>

      <MiningMap title="Ubicacion de la Mina" center={[minaData.latitud, minaData.longitud]} zoom={14} markers={mapMarkers} height="300px" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="lugares">Lugares</TabsTrigger>
          <TabsTrigger value="flota">Flota</TabsTrigger>
          <TabsTrigger value="alarmas">Alarmas</TabsTrigger>
        </TabsList>

        <TabsContent value="lugares" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lugares de la Mina</CardTitle>
              <Link href={`/minas/${params.id}/lugares`}>
                <Button size="sm" className="bg-primary text-primary-foreground">Ver Todos</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lugaresData.map((lugar) => (
                  <div key={lugar.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{lugar.nombre}</span>
                    </div>
                    <Badge variant="outline">{lugar.tipo.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flota" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Flota Asignada</CardTitle>
              <Link href="/flota">
                <Button size="sm" variant="outline">Ver Toda la Flota</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flotaData.map((unidad) => (
                  <div key={unidad.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Truck className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{unidad.codigo}</p>
                        <p className="text-xs text-muted-foreground">{unidad.tipo}</p>
                      </div>
                    </div>
                    <Badge className={unidad.estado === "activo" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"}>{unidad.estado}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarmas" className="mt-4">
          <Card className="bg-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Alarmas Activas</CardTitle>
              <Link href="/alarmas">
                <Button size="sm" variant="outline">Ver Todas</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alarmasData.map((alarma) => (
                  <div key={alarma.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-4 w-4 ${alarma.severidad === "alta" ? "text-red-500" : "text-yellow-500"}`} />
                      <div>
                        <p className="font-medium">{alarma.tipo}</p>
                        <p className="text-xs text-muted-foreground">{alarma.mensaje}</p>
                      </div>
                    </div>
                    <Badge className={alarma.severidad === "alta" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}>{alarma.severidad}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
