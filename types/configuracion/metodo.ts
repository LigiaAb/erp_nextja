export interface MetodosRequest {
  status: number;
  message: string;
  length: number;
  data: Metodo[];
}

export interface Metodo {
  cod_metodo: number;
  cod_servicio: number;
  cod_tipo: number | null;
  cod_tipo_tarifa: number;
  todos_los_paises: boolean;
  todos_los_clientes: boolean | null;
  todos_los_commodities: boolean;
  fecha_inicial: Date;
  fecha_final: Date | null;
  cod_estado: number;
}

export interface InsertarMetodoBody {
  cod_estado: number;
  cod_servicio: number;
  cod_tipo: number | null;
  todos_los_paises: boolean | null;
  todos_los_commodities: boolean | null;
  todos_los_clientes: boolean | null;
  cod_tipo_tarifa: number | null;
  fecha_inicial: Date;
  fecha_final: number | null;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  cod_usuario: number | null;
}

export interface ActualizarMetodoBody {
  cod_estado: number;
  cod_servicio: number;
  cod_tipo: number | null;
  todos_los_paises: boolean | null;
  todos_los_commodities: boolean | null;
  todos_los_clientes: boolean | null;
  cod_tipo_tarifa: number | null;
  cod_metodo: number;
  fecha_inicial: Date;
  fecha_final: number | null;
  fecha_creacion: Date;
  fecha_modificacion: Date;
  cod_usuario: number | null;
}
