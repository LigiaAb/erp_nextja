"use client";

import { createCatalogFetcher, createCatalogHook, createCatalogMutationFetcher, createCatalogMutationHook, type CatalogBase } from "../fetchFactory";
import { ActualizarTipoDocumentacionBody, InsertarTipoDocumentacionBody, TipoDocumentacion, CatalogoError, Commodity, InsertarCommodityBody, ActualizarCommodityBody } from "@/types/configuracion";

export type CatalogTipoDocumentacion = TipoDocumentacion & CatalogBase;
export type CatalogoErrores = CatalogoError & CatalogBase;
export type CatalogoComodity = Commodity & CatalogBase;

const ENDPOINTS = {
  // TIPOS DE DOCUMENTACION
  tipo_documentacion: "/api/appweb/lista-tipo-documentacion",
  insertar_tipo_documentacion: "/api/appweb/insertar-tipo-documentacion",
  actualizar_tipo_documentacion: "/api/appweb/actualizar-tipo-documentacion/",

  // CATALOGO DE ERRORES
  catalogo_errores: "/public/api/listado-catalogo-errores",

  // COMMODITIES
  commodities: "/api/appweb/lista-commodities",
  insertar_commodities: "/api/appweb/insertar-commodity",
  actualizar_commodities: "/api/appweb/actualizar-commodity",
} as const;

function mapTipoDocumentacion(item: TipoDocumentacion): CatalogTipoDocumentacion {
  const value = item.cod_tip_docu ?? 0;
  const label = item.desc_tip_docu ?? "";

  return { ...item, label, value };
}
function mapCatalogoErrores(item: CatalogoError): CatalogoErrores {
  const value = item.cod_error ?? 0;
  const label = item.desc_error ?? "";

  return { ...item, label, value };
}
function mapCommodity(item: Commodity): CatalogoComodity {
  const value = item.cod_commodity ?? 0;
  const label = item.nombre ?? "";

  return { ...item, label, value };
}

// GLOBAL USE
// TIPOS DE DOCUMENTACION
export const fetchTipoDocumentacion = createCatalogFetcher(ENDPOINTS.tipo_documentacion, mapTipoDocumentacion);
export const insertarTipoDocumentacion = createCatalogMutationFetcher<InsertarTipoDocumentacionBody, TipoDocumentacion>(ENDPOINTS.insertar_tipo_documentacion, "POST");
export const actualizarTipoDocumentacion = createCatalogMutationFetcher<ActualizarTipoDocumentacionBody, TipoDocumentacion>(ENDPOINTS.actualizar_tipo_documentacion, "POST");
// CATALOGO DE ERRORES
export const fetchCatalogoErrores = createCatalogFetcher(ENDPOINTS.catalogo_errores, mapCatalogoErrores);
// COMMODITIES
export const fetchCommodities = createCatalogFetcher(ENDPOINTS.commodities, mapCommodity);
export const insertarCommodities = createCatalogMutationFetcher<InsertarCommodityBody, Commodity>(ENDPOINTS.insertar_commodities, "POST");
export const actualizarCommodities = createCatalogMutationFetcher<ActualizarCommodityBody, Commodity>(ENDPOINTS.actualizar_commodities, "POST");

// HOOKS
// TIPOS DE DOCUMENTACION
export const useFetchTipoDocumentacion = createCatalogHook("tipo_documentacion", fetchTipoDocumentacion);
export const useInsertarTipoDocumentacion = createCatalogMutationHook<InsertarTipoDocumentacionBody, TipoDocumentacion>("insertar_tipo_documentacion", insertarTipoDocumentacion);
export const useActualizarTipoDocumentacion = createCatalogMutationHook<ActualizarTipoDocumentacionBody, TipoDocumentacion>("actualizar_tipo_documentacion", actualizarTipoDocumentacion);
// CATALOGO DE ERRORES
export const useFetchCatalogoErrores = createCatalogHook("catalogo_errores", fetchCatalogoErrores);
// COMMODITIES
export const useFetchCommodities = createCatalogHook("commodities", fetchCommodities);
export const useInsertarCommodities = createCatalogMutationHook<InsertarCommodityBody, Commodity>("insertar_commodities", insertarCommodities);
export const useActualizarCommodities = createCatalogMutationHook<ActualizarCommodityBody, Commodity>("actualizar_commodities", actualizarCommodities);
