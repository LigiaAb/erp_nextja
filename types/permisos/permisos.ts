export interface PermisosConsulta {
  cod_usuario: number;
}

export interface PermisosUsuarios {
  configuracion: Configuracion;
  permisos: Permisos;
}

export interface Configuracion {
  paises: number[];
  empresas: number[];
  centrosCosto: number[];
  puesto_default: PuestoDefault;
  ruta_inicial: string;
}

export interface PuestoDefault {
  cod_puesto: number;
  puesto_desc: string;
  cod_pais: number;
  cod_emp: number;
  cod_cc: number;
  nombre_pais: string;
  nombre_emp: string;
  nombre_cc: string;
  cod_estado: number;
  estado_desc: string;
  cod_tipo_asignacion: number;
}

export interface Permisos {
  paises: { [key: string]: PermisosPais };
}

export interface PermisosPais {
  cod_pais: number;
  nombre_pais: string;
  empresas: { [key: string]: PermisosEmpresa };
}

export interface PermisosEmpresa {
  cod_empresa: number;
  nombre_emp: string;
  centrosCosto: { [key: string]: PermisosCentroCosto };
}

export interface PermisosCentroCosto {
  cod_cc: number;
  nombre_cc: string;
  modulos?: { [key: string]: PermisosModulo };
}

export interface PermisosModulo {
  cod_modulo: number;
  nom_modulo: string;
  modulo_ruta: string;
  menus?: { [key: string]: PermisosMenu };
}

export interface PermisosMenu {
  cod_menu: number;
  nom_menu: string;
  cod_cc: number;
  cod_empresa: number;
  menu_ruta: string;
  categorias?: { [key: string]: PermisosCategoria };
}

export interface PermisosCategoria {
  cod_categoria: number;
  nom_cat: string;
  ruta_cat: string;
  opciones?: { [key: string]: PermisosOpcion };
}

export interface PermisosOpcion {
  cod_opcion: number;
  nom_opcion: string;
  nivel_opcion: string;
  acciones?: { [key: string]: PermisosAccion };
}

export interface PermisosAccion {
  cod_accion: number;
  nom_accion: string;
}
