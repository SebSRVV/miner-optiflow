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

// ========== ESTADÍSTICAS HISTÓRICAS ==========

export interface IncidentesPorDia {
  fecha: string;
  incidentes: number;
}

export interface AlarmasPorSeveridad {
  severidad: string;
  cantidad: number;
}

export async function obtenerIncidentesUltimos7Dias(idMina: number): Promise<IncidentesPorDia[]> {
  const hace7Dias = new Date();
  hace7Dias.setDate(hace7Dias.getDate() - 7);
  
  const { data, error } = await supabase
    .from("incidentes_seguridad")
    .select("creado_en")
    .eq("id_mina", idMina)
    .gte("creado_en", hace7Dias.toISOString());
  
  if (error) throw error;
  
  // Agrupar por día
  const diasSemana = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const conteo: Record<string, number> = {};
  
  // Inicializar últimos 7 días
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const dia = diasSemana[fecha.getDay()];
    conteo[dia] = 0;
  }
  
  // Contar incidentes por día
  (data || []).forEach((inc) => {
    const fecha = new Date(inc.creado_en);
    const dia = diasSemana[fecha.getDay()];
    if (conteo[dia] !== undefined) {
      conteo[dia]++;
    }
  });
  
  // Convertir a array ordenado
  const resultado: IncidentesPorDia[] = [];
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const dia = diasSemana[fecha.getDay()];
    resultado.push({ fecha: dia, incidentes: conteo[dia] || 0 });
  }
  
  return resultado;
}

export async function obtenerAlarmasPorSeveridad(idMina: number): Promise<AlarmasPorSeveridad[]> {
  const { data, error } = await supabase
    .from("alarmas_disparadas")
    .select("severidad")
    .eq("id_mina", idMina);
  
  if (error) throw error;
  
  const conteo: Record<string, number> = {
    critica: 0,
    alta: 0,
    media: 0,
    baja: 0,
  };
  
  (data || []).forEach((alarma) => {
    if (conteo[alarma.severidad] !== undefined) {
      conteo[alarma.severidad]++;
    }
  });
  
  return [
    { severidad: "Critica", cantidad: conteo.critica },
    { severidad: "Alta", cantidad: conteo.alta },
    { severidad: "Media", cantidad: conteo.media },
    { severidad: "Baja", cantidad: conteo.baja },
  ];
}

export async function obtenerTrabajadoresPorEmpresa(): Promise<{ empresa: string; cantidad: number }[]> {
  const { data, error } = await supabase
    .from("trabajadores")
    .select("empresa_contratista");
  
  if (error) throw error;
  
  const conteo: Record<string, number> = {};
  
  (data || []).forEach((t) => {
    const empresa = t.empresa_contratista || "Sin asignar";
    conteo[empresa] = (conteo[empresa] || 0) + 1;
  });
  
  return Object.entries(conteo)
    .map(([empresa, cantidad]) => ({ empresa, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);
}

export async function obtenerIncidentesPorClasificacion(idMina: number): Promise<{ clasificacion: string; cantidad: number }[]> {
  const { data, error } = await supabase
    .from("incidentes_seguridad")
    .select("clasificacion")
    .eq("id_mina", idMina);
  
  if (error) throw error;
  
  const conteo: Record<string, number> = {
    leve: 0,
    moderado: 0,
    grave: 0,
    fatal: 0,
  };
  
  (data || []).forEach((inc) => {
    if (conteo[inc.clasificacion] !== undefined) {
      conteo[inc.clasificacion]++;
    }
  });
  
  return [
    { clasificacion: "Leve", cantidad: conteo.leve },
    { clasificacion: "Moderado", cantidad: conteo.moderado },
    { clasificacion: "Grave", cantidad: conteo.grave },
    { clasificacion: "Fatal", cantidad: conteo.fatal },
  ];
}
