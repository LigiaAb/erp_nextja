export interface Actividades2Request {
  status: number;
  message: string;
  length: number;
  data: Actividad2[];
}

export interface Actividad2 {
  cod_actividad: number;
  fecha_creada: string;
  asunto: string;
  descripcion: string;
  cod_tipo: number;
  nom_tipo: string;
  fecha_programada: string;
  cod_emp: number;
  cod_cc: number;
  cod_estado: number;
  estado_desc: string;
  cod_asesor: number;
  cod_cliente: number;
  nombre_cliente: string;
  cod_documento: null | string;
  cod_objetivo_actividad: number | null;
  objetivo_actividad_desc: null | string;
  cod_creador: number;
  contacto: null | string;
  resultado: null | string;
}
