// modules/dashboard/hooks/useSyncNavigationFromPath.ts
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

import { setCurrentCategoria, setCurrentMenu, setCurrentModulo, setCurrentModuloName } from "@/store/navigation/navigationSlice";

type TreeItem = {
  value: number;
  label: string;
  icon?: string;
  ruta?: string;
  children?: TreeItem[];
  raw: unknown;
};

type Params = {
  treeItems: TreeItem[];
  setOpenModulo: React.Dispatch<React.SetStateAction<number | null>>;
  setOpenMenu: React.Dispatch<React.SetStateAction<number | null>>;
};

const normalize = (ruta?: string) => (ruta ?? "").replace(/^\/+|\/+$/g, "");

export function useSyncNavigationFromPath({ treeItems, setOpenModulo, setOpenMenu }: Params) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!pathname) return;
    if (!treeItems.length) return;

    const partes = pathname.split("/").filter(Boolean);

    const moduloRuta = partes[1];
    const menuRuta = partes[2];
    const categoriaRuta = partes[3];

    if (!moduloRuta || !menuRuta || !categoriaRuta) return;

    for (const modulo of treeItems) {
      if (normalize(modulo.ruta) !== moduloRuta) continue;

      for (const menu of modulo.children ?? []) {
        if (normalize(menu.ruta) !== menuRuta) continue;

        for (const categoria of menu.children ?? []) {
          if (normalize(categoria.ruta) !== categoriaRuta) continue;

          dispatch(setCurrentModulo(modulo.value));
          dispatch(setCurrentModuloName(modulo.label));
          dispatch(setCurrentMenu(menu.value));
          dispatch(setCurrentCategoria(categoria.value));

          sessionStorage.setItem("currentModulo", String(modulo.value));
          sessionStorage.setItem("currentModuloName", modulo.label);
          sessionStorage.setItem("currentMenu", String(menu.value));
          sessionStorage.setItem("currentCategoria", String(categoria.value));

          setOpenModulo(modulo.value);
          setOpenMenu(menu.value);

          return;
        }
      }
    }
  }, [pathname, treeItems, dispatch, setOpenModulo, setOpenMenu]);
}
