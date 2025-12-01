import { supabase } from "@/lib/supabase/client";

// Tipos basados en el schema de Supabase
export type ClasificacionIncidente = "leve" | "moderado" | "grave" | "fatal";

export interface Incidente {
  id_incidente: number;
  id_mina?: number;
  id_lugar?: number;
  id_flota?: number;
  id_trabajador?: number;
  tipo: string;
  clasificacion: ClasificacionIncidente;
  descripcion?: string;
  dano_personas?: string;
  dano_material?: string;
  causa_probable?: string;
  acciones_tomadas?: string;
  ts_incidente?: string;
  reportado_por?: number;
  creado_en?: string;
}

// RPC: rpc_crear_incidente - Crear un nuevo incidente
export async function crearIncidente(incidente: {
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
}): Promise<Incidente> {
  const { data, error } = await supabase.rpc("rpc_crear_incidente", {
    p_id_mina: incidente.id_mina,
    p_id_lugar: incidente.id_lugar || null,
    p_id_flota: incidente.id_flota || null,
    p_id_trabajador: incidente.id_trabajador || null,
    p_tipo: incidente.tipo,
    p_clasificacion: incidente.clasificacion,
    p_descripcion: incidente.descripcion || null,
    p_dano_personas: incidente.dano_personas || null,
    p_dano_material: incidente.dano_material || null,
    p_causa_probable: incidente.causa_probable || null,
    p_acciones: incidente.acciones || null,
  });
  if (error) throw error;
  return data as Incidente;
}

// Consulta directa a tabla incidentes_seguridad (si no hay RPC de listar)
export async function listarIncidentes(idMina?: number): Promise<Incidente[]> {
  let query = supabase.from("incidentes_seguridad").select("*");
  
  if (idMina) {
    query = query.eq("id_mina", idMina);
  }
  
  const { data, error } = await query.order("creado_en", { ascending: false });
  if (error) throw error;
  return (data || []) as Incidente[];
}

export async function obtenerIncidente(id: number): Promise<Incidente | null> {
  const { data, error } = await supabase
    .from("incidentes_seguridad")
    .select("*")
    .eq("id_incidente", id)
    .single();
  if (error) throw error;
  return data as Incidente | null;
}
