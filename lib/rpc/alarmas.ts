import { supabase } from "@/lib/supabase/client";

export type SeveridadAlarma = "baja" | "media" | "alta" | "critica";
export type CondicionUmbral = "mayor_que" | "menor_que" | "igual_a" | "entre" | "fuera_de";

export interface AlarmaDisparada {
  id_alarma: number;
  id_umbral?: number;
  id_mina?: number;
  id_lugar?: number;
  id_flota?: number;
  id_dispositivo?: number;
  severidad: SeveridadAlarma;
  mensaje?: string;
  valor_detectado?: number;
  ts_inicio: string;
  ts_fin?: string;
  reconocida_por?: number;
  resuelta_por?: number;
}

export interface UmbralAlarma {
  id_umbral: number;
  id_tipo_alarma: number;
  id_mina?: number;
  id_lugar?: number;
  id_flota?: number;
  id_dispositivo?: number;
  condicion: CondicionUmbral;
  valor_minimo?: number;
  valor_maximo?: number;
  prioridad: number;
  activo: boolean;
  creado_por?: number;
  creado_en?: string;
}

export async function listarAlarmasPorMina(idMina: number): Promise<AlarmaDisparada[]> {
  const { data, error } = await supabase.rpc("rpc_alarmas_por_mina", {
    p_id_mina: idMina,
  });
  if (error) throw error;
  return (data || []) as AlarmaDisparada[];
}

export async function crearUmbral(umbral: {
  tipo: number;
  id_mina?: number;
  id_lugar?: number;
  id_flota?: number;
  id_dispositivo?: number;
  condicion: CondicionUmbral;
  min?: number;
  max?: number;
  prioridad: number;
}): Promise<UmbralAlarma> {
  const { data, error } = await supabase.rpc("rpc_crear_umbral", {
    p_tipo: umbral.tipo,
    p_id_mina: umbral.id_mina || null,
    p_id_lugar: umbral.id_lugar || null,
    p_id_flota: umbral.id_flota || null,
    p_id_dispositivo: umbral.id_dispositivo || null,
    p_condicion: umbral.condicion,
    p_min: umbral.min || null,
    p_max: umbral.max || null,
    p_prioridad: umbral.prioridad,
  });
  if (error) throw error;
  return data as UmbralAlarma;
}

// Crear alarma disparada directamente
export async function crearAlarma(alarma: {
  id_mina: number;
  severidad: SeveridadAlarma;
  mensaje: string;
  valor_detectado?: number;
}): Promise<AlarmaDisparada> {
  const { data, error } = await supabase
    .from("alarmas_disparadas")
    .insert({
      id_mina: alarma.id_mina,
      severidad: alarma.severidad,
      mensaje: alarma.mensaje,
      valor_detectado: alarma.valor_detectado || null,
      ts_inicio: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data as AlarmaDisparada;
}
