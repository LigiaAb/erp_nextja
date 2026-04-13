export interface EstadosRequest {
  status: number;
  message: string;
  length: number;
  data: Estado[];
}

export interface Estado {
  cod_estado: number;
  estado_desc: string;
  cod_tipo: number | null;
  nom_tipo: null | string;
}

export type NomEstado = Estado["estado_desc"];
export type CodEstado = Estado["cod_estado"];
