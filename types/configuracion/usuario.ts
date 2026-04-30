export interface UsuarioRequest {
  status: number;
  message: string;
  length: number;
  data: Usuario[];
}

export interface Usuario {
  cod_usuario: number;
  usuario: string;
  cod_estado: number;
  cod_cambio_pass: number;
  ultima_conexion: string | null;
  json: null | string;
  ruta_inicial: string | null;
  cod_cropa: null | string;
}
