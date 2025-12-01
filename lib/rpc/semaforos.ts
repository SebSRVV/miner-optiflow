import { supabase } from "@/lib/supabase/client";

// Tipos basados en el schema de Supabase
export type EstadoSemaforo = "rojo" | "amarillo" | "verde" | "apagado" | "intermitente";

export interface Semaforo {
  id_semaforo: number;
  id_lugar?: number;
  codigo: string;
  nombre?: string;
  estado_actual: EstadoSemaforo;
  creado_por?: number;
  creado_en?: string;
}

export interface EstadoSemaforoActual {
  id_estado: number;
  id_semaforo: number;
  estado: EstadoSemaforo;
  ts_inicio: string;
  ts_fin?: string;
  cambiado_por?: number;
}

export interface SimulacionSemaforo {
  id_simulacion: number;
  id_plan: number;
  nombre: string;
  descripcion?: string;
  duracion_segundos: number;
  activa: boolean;
}

// RPC: rpc_listar_semaforos - Sin parametros, retorna SETOF semaforos
export async function listarSemaforos(): Promise<Semaforo[]> {
  const { data, error } = await supabase.rpc("rpc_listar_semaforos");
  if (error) throw error;
  return (data || []) as Semaforo[];
}

// RPC: rpc_estado_actual_semaforo(p_id) - Obtener estado actual
export async function obtenerEstadoSemaforo(id: number): Promise<EstadoSemaforoActual | null> {
  const { data, error } = await supabase.rpc("rpc_estado_actual_semaforo", {
    p_id: id,
  });
  if (error) throw error;
  return data as EstadoSemaforoActual | null;
}

// RPC: rpc_simulaciones_por_plan(p_id_plan) - Obtener simulaciones de un plan
export async function obtenerSimulacionesPorPlan(idPlan: number): Promise<SimulacionSemaforo[]> {
  const { data, error } = await supabase.rpc("rpc_simulaciones_por_plan", {
    p_id_plan: idPlan,
  });
  if (error) throw error;
  return (data || []) as SimulacionSemaforo[];
}

// Consulta directa a tabla semaforos (para obtener un semaforo por ID)
export async function obtenerSemaforo(id: number): Promise<Semaforo | null> {
  const { data, error } = await supabase
    .from("semaforos")
    .select("*")
    .eq("id_semaforo", id)
    .single();
  if (error) throw error;
  return data as Semaforo | null;
}

// Consulta directa para cambiar estado (si no hay RPC)
export async function cambiarEstadoSemaforo(id: number, estado: EstadoSemaforo) {
  const { data, error } = await supabase
    .from("semaforos")
    .update({ estado_actual: estado })
    .eq("id_semaforo", id)
    .select()
    .single();
  if (error) throw error;
  return data as Semaforo;
}
