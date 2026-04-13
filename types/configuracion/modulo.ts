import { NomEstado, CodEstado } from "./estados";
import { Menu } from "./menu";

export interface ModulosRequest {
  status: number;
  message: string;
  length: number;
  data: Modulo[];
}

export interface Modulo {
  cod_modulo: number;
  nom_modulo: string;
  ico_modulo: string;
  cod_estado: CodEstado;
  estado_desc: NomEstado;
  modulo_ruta: string;
  value: number; // For autocomplete
  label: string; // For autocomplete
  menus?: Menu[];
}
