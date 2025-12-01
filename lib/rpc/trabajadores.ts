import { supabase } from "@/lib/supabase/client";

export interface Trabajador {
  id_trabajador: number;
  nombre_completo: string;
  doc_identidad?: string;
  cargo?: string;
  empresa_contratista?: string;
  creado_por?: number;
  creado_en?: string;
}

// RPC: rpc_listar_trabajadores - Sin parametros, retorna SETOF trabajadores
export async function listarTrabajadores(): Promise<Trabajador[]> {
  const { data, error } = await supabase.rpc("rpc_listar_trabajadores");
  if (error) throw error;
  return (data || []) as Trabajador[];
}

// RPC: rpc_crear_trabajador(p_nombre, p_doc, p_cargo, p_empresa)
export async function crearTrabajador(trabajador: {
  nombre: string;
  doc: string;
  cargo?: string;
  empresa?: string;
}): Promise<Trabajador> {
  const { data, error } = await supabase.rpc("rpc_crear_trabajador", {
    p_nombre: trabajador.nombre,
    p_doc: trabajador.doc,
    p_cargo: trabajador.cargo || null,
    p_empresa: trabajador.empresa || null,
  });
  if (error) throw error;
  return data as Trabajador;
}

// Consulta directa para obtener un trabajador por ID
export async function obtenerTrabajador(id: number): Promise<Trabajador | null> {
  const { data, error } = await supabase
    .from("trabajadores")
    .select("*")
    .eq("id_trabajador", id)
    .single();
  if (error) throw error;
  return data as Trabajador | null;
}
