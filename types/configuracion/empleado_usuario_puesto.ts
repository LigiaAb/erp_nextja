import { Empleado, Usuario, Puesto } from "./";

export interface EmpleadoXUsuarioXPuestoRequestTs {
  status: number;
  message: string;
  length: number;
  data: EmpleadoXUsuarioXPuesto[];
}

export type EmpleadoXUsuarioXPuesto = Partial<Empleado & Usuario & Puesto> & {
  usuemppue_default: UsuemppueDefault;
};

export enum UsuemppueDefault {
  N = "N",
  S = "S",
}
