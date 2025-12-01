import { supabase } from "@/lib/supabase/client";

// Interfaces para metricas
export interface DashboardResumen {
  incidentes_hoy: number;
  alarmas_criticas: number;
  flota_activa: number;
  trabajadores_turno: number;
}

// RPC: rpc_dashboard_resumen(p_id_mina) - Resumen del dashboard
export async function obtenerDashboardResumen(idMina: number): Promise<DashboardResumen> {
  const { data, error } = await supabase.rpc("rpc_dashboard_resumen", {
    p_id_mina: idMina,
  });
  if (error) throw error;
  
  if (data && data.length > 0) {
    return data[0] as DashboardResumen;
  }
  
  return {
    incidentes_hoy: 0,
    alarmas_criticas: 0,
    flota_activa: 0,
    trabajadores_turno: 0,
  };
}

// Consultas directas para metricas adicionales
export async function contarFlotaPorMina(idMina: number): Promise<number> {
  const { count, error } = await supabase
    .from("asignaciones_flota_mina")
    .select("*", { count: "exact", head: true })
    .eq("id_mina", idMina)
    .eq("activo", true);
  if (error) throw error;
  return count || 0;
}

export async function contarDispositivosActivos(): Promise<number> {
  const { count, error } = await supabase
    .from("dispositivos_iot")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

export async function contarTrabajadores(): Promise<number> {
  const { count, error } = await supabase
    .from("trabajadores")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

export async function contarAlarmasActivasPorMina(idMina: number): Promise<number> {
  const { count, error } = await supabase
    .from("alarmas_disparadas")
    .select("*", { count: "exact", head: true })
    .eq("id_mina", idMina)
    .is("ts_fin", null);
  if (error) throw error;
  return count || 0;
}
