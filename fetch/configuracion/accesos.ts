"use client";

import { Modulo } from "@/types/configuracion/modulo";
import { createCatalogFetcher, createCatalogHook, type CatalogBase } from "../fetchFactory";
import { Menu } from "@/types/configuracion/menu";
import { Categoria } from "@/types/configuracion/categoria";

export type CatalogModulo = Modulo & CatalogBase;
export type CatalogMenu = Menu & CatalogBase;
export type CatalogCategoria = Categoria & CatalogBase;

const ENDPOINTS = {
  modulos: "/api/appweb/listamodulo",
  menus: "/api/appweb/lista-menu",
  categorias: "/api/appweb/lista-categoria",
} as const;

function mapModulo(item: Modulo): CatalogModulo {
  const cod_modulo = item.cod_modulo ?? 0;
  const nom_modulo = item.nom_modulo ?? "";

  return {
    ...item,
    label: nom_modulo,
    value: cod_modulo,
  };
}

function mapMenu(item: Menu): CatalogMenu {
  const cod_menu = item.cod_menu ?? 0;
  const nom_menu = item.nom_menu ?? "";

  return {
    ...item,
    label: nom_menu,
    value: cod_menu,
  };
}

function mapCategoria(item: Categoria): CatalogCategoria {
  const value = item.cod_categoria ?? 0;
  const label = item.nom_cat ?? "";

  return {
    ...item,
    label,
    value,
  };
}

export const fetchModulos = createCatalogFetcher(ENDPOINTS.modulos, mapModulo);
export const fetchMenus = createCatalogFetcher(ENDPOINTS.menus, mapMenu);
export const fetchCategorias = createCatalogFetcher(ENDPOINTS.categorias, mapCategoria);

export const useFetchModulos = createCatalogHook("modulos", fetchModulos);
export const useFetchMenus = createCatalogHook("menus", fetchMenus);
export const useFetchCategorias = createCatalogHook("categorias", fetchCategorias);
