"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { obtenerDashboardResumen, DashboardResumen } from "@/lib/rpc/metrics";
import { listarAlarmasPorMina, AlarmaDisparada } from "@/lib/rpc/alarmas";
import { listarMinas, crearMina, Mina } from "@/lib/rpc/minas";
import { listarFlota, crearFlota, Flota, ClaseFlota, FamiliaFlota } from "@/lib/rpc/flota";
import { listarDispositivos, crearDispositivo, DispositivoListado, TipoDispositivo } from "@/lib/rpc/dispositivos";
import { listarSemaforos, Semaforo } from "@/lib/rpc/semaforos";
import { listarTrabajadores, crearTrabajador, Trabajador } from "@/lib/rpc/trabajadores";

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

// ========== DASHBOARD ==========
export function useDashboardResumen(idMina: number | null) {
  return useQuery<DashboardResumen, Error>({
    queryKey: ["dashboard-resumen", idMina],
    queryFn: () => obtenerDashboardResumen(idMina!),
    enabled: !!idMina,
    refetchInterval: 30000,
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
