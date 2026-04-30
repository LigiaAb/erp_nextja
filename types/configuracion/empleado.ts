export interface EmpleadoRequestTs {
  status: number;
  message: string;
  length: number;
  data: Empleado[];
}

export interface Empleado {
  cod_empleado: number;
  nom_empleado: string;
  apellido_emp: string;
  sexo_emp: SexoEmp;
  dpi_emp: string;
  cod_estado: number;
}

export enum SexoEmp {
  F = "F",
  M = "M",
}
