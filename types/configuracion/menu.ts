import { Categoria } from "./categoria";

export interface MenuRequest {
  status: number;
  message: string;
  length: number;
  data: Menu[];
}

export interface Menu {
  cod_menu: number;
  nom_menu: string;
  ico_menu: string;
  cod_emp: number;
  cod_cc: number;
  cod_modulo: number;
  nom_modulo: string;
  nombre_emp: string;
  nombre_cc: string;
  fecha_reg: Date;
  menu_ruta: string;
  value: number; // For autocomplete
  label: string; // For autocomplete
  categorias?: Categoria[];
}
