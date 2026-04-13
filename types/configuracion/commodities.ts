export interface CommoditiesResponse {
  status: number;
  message: string;
  length: number;
  data: Commodity[];
}

export interface Commodity {
  cod_commodity: number;
  nombre: string;
  descripcion: string;
  cod_estado: number;
  value: number; // For autocomplete
  label: string; // For autocomplete
}

export type InsertarCommodityBody = {
  nombre: string;
  descripcion: string;
  cod_estado?: number;
};

export type ActualizarCommodityBody = {
  cod_commodity: number;
  nombre: string;
  descripcion: string;
  cod_estado?: number;
};
