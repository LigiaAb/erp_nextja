"use client";

import { Usuario, Empleado } from "@/types/configuracion";
import { EmpleadoXUsuarioXPuesto } from "@/types/configuracion/empleado_usuario_puesto";
import { type CatalogBase, createCatalogFetcher, createCatalogHook, createCatalogMutationFetcher, createCatalogMutationHook } from "../fetchFactory";

export type CatalogEmpleado = Empleado & CatalogBase;
export type CatalogUsuario = Usuario & CatalogBase;
export type CatalogEmpleadoXUsuarioXPuesto = EmpleadoXUsuarioXPuesto & CatalogBase;

const ENDPOINTS = {
  // EMPLEADOS
  empleado: "/api/appweb/lista-empleado",

  // USUARIOS
  usuario: "/api/appweb/listausuario",

  // PUESTO
  puesto: "/api/appweb/lista-puesto",

  // EMPLEADO X USUARIO X PUESTO
  empleado_x_usuario_x_puesto: "/api/appweb/listaemp-usu-puesto",
} as const;

function mapEmpleado(item: Empleado): CatalogEmpleado {
  const value = item.cod_empleado ?? 0;
  const label = `${item.nom_empleado ?? ""} ${item.apellido_emp ?? ""}`;

  return { ...item, label, value };
}
function mapUsuario(item: Usuario): CatalogUsuario {
  const value = item.cod_usuario ?? 0;
  const label = item.usuario ?? "";

  return { ...item, label, value };
}
function mapEmpleadoXUsuarioXPuesto(item: EmpleadoXUsuarioXPuesto): CatalogEmpleadoXUsuarioXPuesto {
  const value = item.cod_empleado ?? 0;
  const label = `${item.nom_empleado ?? ""} ${item.apellido_emp ?? ""}`;

  return { ...item, label, value };
}

// GLOBAL USE
// // COMMODITIES
// export const fetchCommodities = createCatalogFetcher(ENDPOINTS.commodities, mapCommodity);
// export const insertarCommodities = createCatalogMutationFetcher<InsertarCommodityBody, Commodity>(ENDPOINTS.insertar_commodities, "POST");
// export const actualizarCommodities = createCatalogMutationFetcher<ActualizarCommodityBody, Commodity>(ENDPOINTS.actualizar_commodities, "POST");
// EMPLEADOS
export const fetchEmpleados = createCatalogFetcher(ENDPOINTS.empleado, mapEmpleado);
// USUARIOS
export const fetchUsuarios = createCatalogFetcher(ENDPOINTS.usuario, mapUsuario);
// PUESTO
export const fetchPuesto = createCatalogFetcher(ENDPOINTS.puesto, mapEmpleadoXUsuarioXPuesto);
// EMPLEADO X USUARIO X PUESTO
export const fetchEmpleadoXUsuarioXPuesto = createCatalogFetcher(ENDPOINTS.empleado_x_usuario_x_puesto, mapEmpleadoXUsuarioXPuesto);

// HOOKS
// // COMMODITIES
// export const useFetchCommodities = createCatalogHook("commodities", fetchCommodities);
// export const useInsertarCommodities = createCatalogMutationHook<InsertarCommodityBody, Commodity>("insertar_commodities", insertarCommodities);
// export const useActualizarCommodities = createCatalogMutationHook<ActualizarCommodityBody, Commodity>("actualizar_commodities", actualizarCommodities);
// EMPLEADOS
export const useFetchEmpleados = createCatalogHook("empleados", fetchEmpleados);
// USUARIOS
export const useFetchUsuarios = createCatalogHook("usuarios", fetchUsuarios);
// PUESTO
export const useFetchPuesto = createCatalogHook("puesto", fetchPuesto);
// EMPLEADO X USUARIO X PUESTO
export const useFetchEmpleadoXUsuarioXPuesto = createCatalogHook("empleado_x_usuario_x_puesto", fetchEmpleadoXUsuarioXPuesto);
