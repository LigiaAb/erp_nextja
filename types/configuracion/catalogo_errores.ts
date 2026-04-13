export interface CatalogoErroresResponse {
  status: number;
  message: string;
  length: number;
  data: CatalogoError[];
}

export interface CatalogoError {
  corre_cod_error: number;
  cod_error: number;
  desc_error: string;
  cod_tip_error: number;
  desc_tip_error: string;
  fecha_reg: Date;
  value: number; // For autocomplete
  label: string; // For autocomplete
}
