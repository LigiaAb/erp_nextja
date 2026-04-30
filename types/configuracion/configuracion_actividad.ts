export interface ConfiguracionActividadRequest {
  status: number;
  message: string;
  length: number;
  data: ConfiguracionActividad[];
}

export interface ConfiguracionActividad {
  cod_configuracion_actividad: number;
  cod_emp: number;
  cod_cc: number;
  cod_tipo_actividad: number;
  nom_tipo_actividad: string;
  cod_tipo_resultado: number;
  nom_tipo_resultado: string;
  dias_creacion: number;
  dias_cierre: number;
  fecha_creacion: string;
  cod_estado: number;
  estado_desc: string;
  solo_resultado: boolean;
  requiere_cliente: boolean;
  abreviatura: null | string;
  icono: string;
  color: string;
}
