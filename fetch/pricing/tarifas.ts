"use client";

import { TipoRelacion } from "@/types/configuracion/tipo_relacionado";
import { createCatalogFetcher, createCatalogHook, createCatalogMutationFetcher, createCatalogMutationHook, type CatalogBase } from "../fetchFactory";
import { Servicio, Metodo, insertarServicioBody, ActualizarServicioBody, InsertarMetodoBody, ActualizarMetodoBody } from "@/types/configuracion";

export type CatalogServicio = Servicio & CatalogBase;
export type CatalogMetodo = Metodo & CatalogBase;

const ENDPOINTS = {
  // SERVICIOS
  servicios: "/api/appweb/lista-servicios",
  insertar_servicio: "/api/appweb/insertar-servicio",
  actualizar_servicio: "/api/appweb/actualizar-servicio",

  // METODOS
  metodo: "/api/appweb/lista-metodos",
  insertar_metodo: "/api/appweb/insertar-metodos",
  actualizar_metodo: "/api/appweb/actualizar-metodos",
} as const;

function mapServicio(item: Servicio): CatalogServicio {
  const value = item.cod_servicio ?? 0;
  const label = `${item.siglas ?? ""} - ${item.nombre ?? ""}`;

  return { ...item, label, value };
}
function mapMetodo(item: Metodo): CatalogMetodo {
  const value = item.cod_metodo ?? 0;
  const label = "";

  return { ...item, label, value };
}

// GLOBAL USE
// SERVICIO
export const fetchServicios = createCatalogFetcher(ENDPOINTS.servicios, mapServicio);
export const insertarServicio = createCatalogMutationFetcher<insertarServicioBody, Servicio>(ENDPOINTS.insertar_servicio, "POST");
export const actualizarServicio = createCatalogMutationFetcher<ActualizarServicioBody, Servicio>(ENDPOINTS.actualizar_servicio, "POST");
// METODO
export const fetchMetodos = createCatalogFetcher(ENDPOINTS.metodo, mapMetodo);
export const insertarMetodos = createCatalogMutationFetcher<InsertarMetodoBody, Metodo>(ENDPOINTS.insertar_metodo, "POST");
export const actualizarMetodos = createCatalogMutationFetcher<ActualizarMetodoBody, Metodo>(ENDPOINTS.actualizar_metodo, "POST");

// HOOKS
// SERVICIO
export const useFetchServicios = createCatalogHook("servicios", fetchServicios);
export const useInsertarServicio = createCatalogMutationHook<insertarServicioBody, Servicio>("insertar_servicio", insertarServicio);
export const useActualizarServicio = createCatalogMutationHook<ActualizarServicioBody, Servicio>("actualizar_servicio", actualizarServicio);
// METDOO
export const useFetchMetodos = createCatalogHook("metodos", fetchMetodos);
export const useInsertarMetodo = createCatalogMutationHook<InsertarMetodoBody, Metodo>("insertar_metodo", insertarMetodos);
export const useActualizarMetodo = createCatalogMutationHook<ActualizarMetodoBody, Metodo>("actualizar_metodo", actualizarMetodos);
