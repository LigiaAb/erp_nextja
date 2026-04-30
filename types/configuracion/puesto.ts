export interface PuestoRequest {
  status: number;
  message: string;
  length: number;
  data: Puesto[];
}

export interface Puesto {
  cod_puesto: number;
  puesto_desc: string;
  cod_emp: number;
  cod_cc: number;
  nombre_emp: string;
  nombre_cc: string;
  cod_estado: number;
  estado_desc: string;
  cod_tipo_asignacion: number | null;
  fecha_reg: string;
  json_puesto: string;
  fecha_ultimo_cambio_json: string;
}
