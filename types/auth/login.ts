export interface ResEmpUsuPuesto {
  json: { status: number; message: string; length: number; data: DetResEmpUsuPuesto[] };
}

export interface DetResEmpUsuPuesto {
  COD_PUESTO: number;
  COD_EMPLEADO: number;
  NOM_EMPLEADO: string;
  APELLIDO_EMP: string;
  SEXO_EMP: string;
  DPI_EMP: string;
  COD_USUARIO: number;
  USUARIO: string;
  COD_ESTADO: number;
  ESTADO_DESC: string;
  PUESTO_DESC: string;
  COD_EMP: number;
  COD_CC: number;
  NOMBRE_EMP: string;
  NOMBRE_CC: string;
  USUEMPPUE_DEFAULT: "S" | "N";
}

export type LoginBody = {
  usuario: string;
  pass: string;
};

export type LoginResult = {
  ok: boolean;
  message?: string;
  cod_usuario?: string;
  token?: string;
  version_app?: string;
};

export type LoginResponse = {
  status: number;
  message: string;
  data: DataResponse;
};

export type DataResponse = {
  success: boolean;
  estado_token: boolean;
  cod_mensaje: number;
  mensaje: string;
  cod_usuario: string;
  version_app: string;
  token_usuario: string;
};

export type LoginApiError = {
  status: number;
  message: string;
  data: DataError;
};

export type DataError = {
  success: boolean;
  cod_mensaje: number;
  mensaje: string;
};
