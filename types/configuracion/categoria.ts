import { CodEstado, NomEstado } from "./estados";

export interface CategoriaRequest {
  status: number;
  message: string;
  length: number;
  data: Categoria[];
}

export interface Categoria {
  cod_categoria: number;
  nom_cat: string;
  ico_cat: string;
  ruta_cat: string;
  cod_estado: CodEstado;
  estado_desc: NomEstado;
  value: number; // For autocomplete
  label: string; // For autocomplete
}
