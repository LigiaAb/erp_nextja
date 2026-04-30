import { Servicio } from "@/types/configuracion";
import { Ctx } from "@/types/permisos/context";

export const DEFAULT_TODOS_VALUE = null;

export const CATALOGOS_AGREGAR_TODOS = {
  tiposServicio: true,
  tiposAplicacion: true,
  clasificacionesCarga: true,
  tiposCarga: true,
  categoriasTransporte: true,
  incoterms: true,
};

export const convertClasificacionServicio = (actual: number) => {
  if (actual === 0 || actual === 277) return 277; // INTERNO
  if (actual === 1 || actual === 278) return 278; // EXTERNO
  if (actual === 2 || actual === 275) return 275; // DUE AGENT
  if (actual === 3 || actual === 274) return 274; // DUE CARRIER
  if (actual === 4 || actual === 276) return 276; // FLETE
  if (actual === 5 || actual === 347) return 347; // FLETE EXPRESS
  return null;
};

export const setServicioBase = (ctx: Ctx | null): Servicio => ({
  cod_servicio: 0,
  cod_cc: ctx?.centroCostoId?.cod_cc ?? 0,
  cod_empresa: ctx?.empresaId?.cod_empresa ?? 0,
  cod_rubro: 0,
  cod_tipo_servicio: 0,
  cod_tipo_aplicacion: 0,
  categoria_transporte: 0,
  clasificacion: 0,
  cod_estado: 1,
  cod_clasificacion_carga: 0,
  cod_tipo_calculo: 0,
  cod_tipo_carga: 0,
  cod_tipo_pago: 0,
  incoterm_id: 0,
  cod_tipo_transporte: 0,
  entidad_id: 0,
  nombre: "",
  siglas: "",
  servicio_interno: false,
  servicio_especial: false,
  obligatorio: false,
});
