import { supabase } from "@/lib/supabase/client";

// Tipos basados en el schema de Supabase
export type TipoDispositivo = "gps" | "semaforo" | "proximidad" | "velocimetro" | "sensor_gas" | "camara";

export interface Dispositivo {
  id_dispositivo: number;
  codigo: string;
  tipo: TipoDispositivo;
  marca_modelo?: string;
  creado_por?: number;
  creado_en?: string;
}

export interface DispositivoListado {
  id_dispositivo: number;
  codigo: string;
  tipo: TipoDispositivo;
  id_flota?: number;
  id_lugar?: number;
}

// RPC: rpc_listar_dispositivos - Sin parametros, retorna TABLE
export async function listarDispositivos(): Promise<DispositivoListado[]> {
  const { data, error } = await supabase.rpc("rpc_listar_dispositivos");
  if (error) throw error;
  return (data || []) as DispositivoListado[];
}

// RPC: rpc_crear_dispositivo(p_codigo, p_tipo, p_marca)
export async function crearDispositivo(dispositivo: {
  codigo: string;
  tipo: TipoDispositivo;
  marca?: string;
}): Promise<Dispositivo> {
  const { data, error } = await supabase.rpc("rpc_crear_dispositivo", {
    p_codigo: dispositivo.codigo,
    p_tipo: dispositivo.tipo,
    p_marca: dispositivo.marca || null,
  });
  if (error) throw error;
  return data as Dispositivo;
}

// RPC: rpc_instalar_dispositivo(p_id_dispositivo, p_id_flota, p_id_lugar)
export async function instalarDispositivo(instalacion: {
  id_dispositivo: number;
  id_flota?: number;
  id_lugar?: number;
}) {
  const { data, error } = await supabase.rpc("rpc_instalar_dispositivo", {
    p_id_dispositivo: instalacion.id_dispositivo,
    p_id_flota: instalacion.id_flota || null,
    p_id_lugar: instalacion.id_lugar || null,
  });
  if (error) throw error;
  return data;
}
