"use client";

import { Actividad2 } from "@/types/crm/actividades2";
import { createCatalogFetcher, createCatalogHook, createSummaryFetcher, createSummaryHook, type CatalogBase } from "../fetchFactory";
import { ConteoActividades } from "@/types/crm/conteo_actividades";

export type CatalogActividades2 = Actividad2 & CatalogBase;

const ENDPOINTS = {
  actividades2: "/api/appweb/lista-actividades2",

  conteo_actividades: "/api/appweb/conteo-actividades",
} as const;

function mapActividades2(item: Actividad2): CatalogActividades2 {
  const cod_modulo = item.cod_actividad ?? 0;
  const nom_modulo = item.descripcion ?? "";

  return {
    ...item,
    label: nom_modulo,
    value: cod_modulo,
  };
}
function mapResumenActividades2(data: ConteoActividades): ConteoActividades {
  return {
    total: data.total ?? 0,
    tipos: data.tipos ?? {},
    estados: data.estados ?? {},
  };
}

// ACTIVIDADES 2
export const fetchActividades2 = createCatalogFetcher(ENDPOINTS.actividades2, mapActividades2);
// CONTEO DE ACTIVIDADES
export const fetchConteoActividades = createSummaryFetcher(ENDPOINTS.conteo_actividades, mapResumenActividades2);

// ACTIVIDADES 2
export const useFetchActividades2 = createCatalogHook("actividades2", fetchActividades2);
// CONTEO DE ACTIVIDADES
export const useFetchConteoActividades = createSummaryHook("conteo_actividades", fetchConteoActividades);
