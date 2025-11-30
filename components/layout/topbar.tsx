"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  AlertTriangle,
  Mountain,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";

const notifications = [
  {
    id: 1,
    type: "critical",
    title: "Alarma Critica",
    message: "Velocidad excesiva en Scooptram SC-003 - Nivel 2000",
    time: "Hace 2 min",
  },
  {
    id: 2,
    type: "warning",
    title: "Alerta de Proximidad",
    message: "Vehiculos cercanos en Cruce Rampa Principal - Pataz",
    time: "Hace 15 min",
  },
  {
    id: 3,
    type: "info",
    title: "Dispositivo Conectado",
    message: "GPS-042 reconectado en Nivel 1800 - Santa Maria",
    time: "Hace 1 hora",
  },
];

const zonasOperacion = [
  { id: "all", name: "Todas las Zonas" },
  { id: "1", name: "Nivel 2000 - Santa Maria" },
  { id: "2", name: "Nivel 1800 - Pataz" },
  { id: "3", name: "Rampa Principal - Poderosa" },
  { id: "4", name: "Superficie - Planta Marañon" },
];

interface TopbarProps {
  sidebarCollapsed?: boolean;
}

export function Topbar({ sidebarCollapsed = false }: TopbarProps) {
  const router = useRouter();
  const [selectedZona, setSelectedZona] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState<{ email: string; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          email: user.email || "usuario@gmail.com",
          name: user.user_metadata?.nombre || user.user_metadata?.name || user.email?.split("@")[0] || "Operador",
        });
      }
      setIsLoading(false);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    setShowLogoutDialog(true);
    await supabase.auth.signOut();
    setTimeout(() => {
      router.push("/auth/login?logout=success");
    }, 1500);
  };

  const unreadCount = notifications.filter((n) => n.type === "critical").length;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-6"
    >
            <div className="flex items-center gap-4">
                <Select value={selectedZona} onValueChange={setSelectedZona}>
          <SelectTrigger className="w-[220px] bg-card border-border/50 hover:border-primary/50 transition-colors">
            <Mountain className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="Seleccionar zona" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {zonasOperacion.map((zona) => (
              <SelectItem key={zona.id} value={zona.id}>
                {zona.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

                <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar unidades, alarmas, incidentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px] pl-10 bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

            <div className="flex items-center gap-4">
                <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-primary/10 hover:text-primary"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white"
                >
                  {unreadCount}
                </motion.span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-[380px] p-0 bg-card border-border"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <h4 className="font-semibold">Notificaciones</h4>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {notifications.length} nuevas
              </Badge>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        notification.type === "critical"
                          ? "bg-destructive/20 text-destructive"
                          : notification.type === "warning"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {notification.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-border/50 p-2">
              <Button
                variant="ghost"
                className="w-full text-primary hover:text-primary hover:bg-primary/10"
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </PopoverContent>
        </Popover>

                {isLoading ? (
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="hidden md:flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {userData?.name?.substring(0, 2).toUpperCase() || "OP"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{userData?.name || "Operador"}</span>
                  <span className="text-xs text-muted-foreground">
                    {userData?.email || "usuario@gmail.com"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={() => router.push("/perfil")} className="cursor-pointer hover:bg-primary/10 hover:text-primary">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/configuracion")} className="cursor-pointer hover:bg-primary/10 hover:text-primary">
                <Settings className="mr-2 h-4 w-4" />
                Configuracion
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            <DialogTitle className="text-center">Sesion Cerrada</DialogTitle>
            <DialogDescription className="text-center">
              Has cerrado sesion correctamente. Redirigiendo al inicio de sesion...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}
