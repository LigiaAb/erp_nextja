export interface ConteoActividadesRequest {
  status: number;
  message: string;
  data: ConteoActividades;
}

export interface ConteoActividades {
  total: number;
  tipos: { [key: string]: number };
  estados: { [key: string]: number };
}
