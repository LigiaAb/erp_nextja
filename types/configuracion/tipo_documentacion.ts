export interface TipoDocumentacionResponse {
  status: number;
  message: string;
  length: number;
  data: TipoDocumentacion[];
}

export interface TipoDocumentacion {
  cod_tip_docu: number;
  desc_tip_docu: string;
  cod_estado: number;
  estado_desc: string;
}

export type InsertarTipoDocumentacionBody = {
  desc_tip_docu: string;
  cod_estado?: number;
};

export type ActualizarTipoDocumentacionBody = {
  cod_tip_docu: number;
  desc_tip_docu: string;
  cod_estado?: number;
};
