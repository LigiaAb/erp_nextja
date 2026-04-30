export interface ServiciosRequest {
  status: number;
  message: string;
  length: number;
  data: Servicio[];
}

export interface Servicio {
  cod_servicio: number;
  nombre: string;
  siglas: string;
  cod_rubro: number;
  cod_tipo_servicio: number | null;
  cod_tipo_transporte: number;
  entidad_id: number | null;
  cod_empresa: number;
  cod_cc: number;
  cod_tipo_calculo: number;
  cod_tipo_aplicacion: number | null;
  cod_tipo_carga: number;
  cod_clasificacion_carga: number;
  incoterm_id: number | null;
  cod_tipo_pago: number | null;
  cod_estado: number;
  servicio_interno: boolean | null;
  clasificacion: number | null;
  servicio_especial: boolean | null;
  categoria_transporte: number | null;
  obligatorio: boolean | null;
}

export type insertarServicioBody = {
  cod_empresa: number;
  cod_cc: number;
  cod_estado: number;
  cod_rubro: number;
  entidad_id: number;
  nombre: string;
  siglas: string;
  cod_tipo_transporte: number;
  cod_tipo_servicio?: number | null;
  clasificacion?: number | null;
  categoria?: number | null;
  obligatorio?: number | null;
  cod_clasificacion_carga?: number | null;
  cod_tipo_carga?: number | null;
  incoterm_id?: number | null;
  cod_tipo_pago: number;
  cod_tipo_aplicacion?: number | null;
  cod_tipo_calculo?: number | null;
  servicio_interno?: number | null;
};
export interface ActualizarServicioBody {
  cod_empresa: number;
  cod_cc: number;
  cod_estado: number;
  cod_servicio: number;
  cod_rubro: number;
  entidad_id: number;
  nombre: string;
  siglas: string;
  cod_tipo_transporte: number;
  cod_tipo_servicio?: number | null;
  clasificacion?: number | null;
  categoria?: number | null;
  obligatorio?: number | null;
  cod_clasificacion_carga?: number | null;
  cod_tipo_carga?: number | null;
  incoterm_id?: number | null;
  cod_tipo_pago: number;
  cod_tipo_aplicacion?: number | null;
  cod_tipo_calculo?: number | null;
  servicio_interno?: number | null;
}
