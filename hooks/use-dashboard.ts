"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  obtenerDashboardResumen, 
  DashboardResumen,
  obtenerIncidentesUltimos7Dias,
  obtenerAlarmasPorSeveridad,
  obtenerIncidentesPorClasificacion,
  IncidentesPorDia,
  AlarmasPorSeveridad,
} from "@/lib/rpc/metrics";
import { listarAlarmasPorMina, AlarmaDisparada } from "@/lib/rpc/alarmas";
import { listarMinas, crearMina, actualizarMina, eliminarMina, Mina } from "@/lib/rpc/minas";
import { listarFlota, crearFlota, actualizarFlota, eliminarFlota, Flota, ClaseFlota, FamiliaFlota } from "@/lib/rpc/flota";
import { listarDispositivos, crearDispositivo, actualizarDispositivo, eliminarDispositivo, DispositivoListado, TipoDispositivo } from "@/lib/rpc/dispositivos";
import { listarSemaforos, Semaforo } from "@/lib/rpc/semaforos";
import { listarTrabajadores, crearTrabajador, actualizarTrabajador, eliminarTrabajador, Trabajador } from "@/lib/rpc/trabajadores";
import { listarIncidentes, crearIncidente, Incidente, ClasificacionIncidente } from "@/lib/rpc/incidentes";

// ========== MINAS ==========
export function useMinas() {
  return useQuery<Mina[], Error>({
    queryKey: ["minas"],
    queryFn: listarMinas,
    staleTime: 60 * 1000, // 1 minuto
  });
}

export function useCrearMina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mina: { nombre: string; codigo: string; ubicacion: string; empresa: string }) => 
      crearMina(mina),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minas"] });
    },
  });
}

export function useActualizarMina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ nombre: string; codigo: string; ubicacion: string; empresa: string }> }) =>
      actualizarMina(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minas"] });
    },
  });
}

export function useEliminarMina() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarMina(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["minas"] });
    },
  });
}

// ========== DASHBOARD ==========
export function useDashboardResumen(idMina: number | null) {
  return useQuery<DashboardResumen, Error>({
    queryKey: ["dashboard-resumen", idMina],
    queryFn: () => obtenerDashboardResumen(idMina!),
    enabled: !!idMina,
    refetchInterval: 30000,
  });
}

export function useIncidentesHistorico(idMina: number | null) {
  return useQuery<IncidentesPorDia[], Error>({
    queryKey: ["incidentes-historico", idMina],
    queryFn: () => obtenerIncidentesUltimos7Dias(idMina!),
    enabled: !!idMina,
    staleTime: 60000,
  });
}

export function useAlarmasPorSeveridad(idMina: number | null) {
  return useQuery<AlarmasPorSeveridad[], Error>({
    queryKey: ["alarmas-severidad", idMina],
    queryFn: () => obtenerAlarmasPorSeveridad(idMina!),
    enabled: !!idMina,
    staleTime: 60000,
  });
}

export function useIncidentesPorClasificacion(idMina: number | null) {
  return useQuery<{ clasificacion: string; cantidad: number }[], Error>({
    queryKey: ["incidentes-clasificacion", idMina],
    queryFn: () => obtenerIncidentesPorClasificacion(idMina!),
    enabled: !!idMina,
    staleTime: 60000,
  });
}

// ========== ALARMAS ==========
export function useAlarmas(idMina: number | null) {
  return useQuery<AlarmaDisparada[], Error>({
    queryKey: ["alarmas", idMina],
    queryFn: () => listarAlarmasPorMina(idMina!),
    enabled: !!idMina,
    refetchInterval: 15000,
  });
}

// ========== FLOTA ==========
export function useFlota(idMina: number | null) {
  return useQuery<Flota[], Error>({
    queryKey: ["flota", idMina],
    queryFn: () => listarFlota(idMina!),
    enabled: !!idMina,
    staleTime: 60000,
  });
}

export function useCrearFlota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (flota: {
      nombre: string;
      clase: ClaseFlota;
      familia: FamiliaFlota;
      tipo_especifico?: string;
      placa?: string;
      marca?: string;
      modelo?: string;
      anio?: number;
      capacidad?: number;
      id_mina: number;
    }) => crearFlota(flota),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flota"] });
    },
  });
}

export function useActualizarFlota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Flota> }) =>
      actualizarFlota(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flota"] });
    },
  });
}

export function useEliminarFlota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarFlota(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flota"] });
    },
  });
}

// ========== DISPOSITIVOS ==========
export function useDispositivos() {
  return useQuery<DispositivoListado[], Error>({
    queryKey: ["dispositivos"],
    queryFn: listarDispositivos,
    staleTime: 60000,
  });
}

export function useCrearDispositivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dispositivo: { codigo: string; tipo: TipoDispositivo; marca?: string }) => 
      crearDispositivo(dispositivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispositivos"] });
    },
  });
}

export function useActualizarDispositivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ codigo: string; tipo: TipoDispositivo; marca_modelo: string }> }) =>
      actualizarDispositivo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispositivos"] });
    },
  });
}

export function useEliminarDispositivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarDispositivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dispositivos"] });
    },
  });
}

// ========== SEMAFOROS ==========
export function useSemaforos() {
  return useQuery<Semaforo[], Error>({
    queryKey: ["semaforos"],
    queryFn: listarSemaforos,
    staleTime: 30000,
  });
}

// ========== TRABAJADORES ==========
export function useTrabajadores() {
  return useQuery<Trabajador[], Error>({
    queryKey: ["trabajadores"],
    queryFn: listarTrabajadores,
    staleTime: 60000,
  });
}

export function useCrearTrabajador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (trabajador: { nombre: string; doc: string; cargo?: string; empresa?: string }) => 
      crearTrabajador(trabajador),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
    },
  });
}

export function useActualizarTrabajador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ nombre_completo: string; doc_identidad: string; cargo: string; empresa_contratista: string }> }) =>
      actualizarTrabajador(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
    },
  });
}

export function useEliminarTrabajador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eliminarTrabajador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
    },
  });
}

// ========== INCIDENTES ==========
export function useIncidentes(idMina: number | null) {
  return useQuery<Incidente[], Error>({
    queryKey: ["incidentes", idMina],
    queryFn: () => listarIncidentes(idMina || undefined),
    enabled: !!idMina,
    staleTime: 30000,
  });
}

export function useCrearIncidente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (incidente: {
      id_mina: number;
      id_lugar?: number;
      id_flota?: number;
      id_trabajador?: number;
      tipo: string;
      clasificacion: ClasificacionIncidente;
      descripcion?: string;
      dano_personas?: string;
      dano_material?: string;
      causa_probable?: string;
      acciones?: string;
    }) => crearIncidente(incidente),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidentes"] });
    },
  });
}
