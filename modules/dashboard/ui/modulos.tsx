"use client";

import React from "react";
import DynamicIcon from "@/components/custom/DynamicIcon";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFetchCategorias, useFetchMenus, useFetchModulos } from "@/fetch/configuracion/accesos";
import { selectcontext } from "@/store/context/contextSlice";
import {
  selectCurrentCategoria,
  selectCurrentMenu,
  selectCurrentModulo,
  setCurrentCategoria,
  setCurrentMenu,
  setCurrentModulo,
  setCurrentModuloName,
} from "@/store/navigation/navigationSlice";
import { selectPermisos } from "@/store/permisos/permisosSlice";
import { ChevronRightIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Categoria, Menu, Modulo } from "@/types/configuracion";
import { cn } from "@/lib/utils";
import { SidebarSeparator, useSidebar } from "@/components/ui/sidebar";
import InputField from "@/components/custom/form/inputField";
import { useRouter } from "next/navigation";
import { sortByText } from "@/lib/sort";
import { logButtonClick } from "@/lib/logs/logButtonClick";
import { logGeneralEvent } from "@/lib/logs/logGeneralEvent";
import { useSyncNavigationFromPath } from "@/modules/dashboard/hooks/useSyncNavigationFromPath";
/**
 * Estructura normalizada para cualquier nivel del árbol.
 *
 * value   -> id del nodo (módulo / menú / categoría)
 * label   -> texto visible
 * icon    -> nombre del icono
 * children-> hijos del nodo, si existen
 * raw     -> objeto original completo, para seguir usando su información real
 */
type TreeItem = {
  value: number;
  label: string;
  icon?: string;
  ruta?: string;
  children?: TreeItem[];
  raw: Modulo | Menu | Categoria;
};

const ACTIVE_CLASS = "bg-background text-foreground font-bold";

/**
 * Une elementos base del catálogo con elementos de permisos.
 * Si no existe base en catálogo, el elemento no se incluye.
 */
function mergeWithCatalog<TBase extends Record<string, any>, TPermission extends Record<string, any>>(
  permissions: TPermission[],
  catalog: TBase[],
  match: (base: TBase, permission: TPermission) => boolean,
): Array<TBase & TPermission> {
  return permissions.flatMap((permissionItem) => {
    const baseItem = catalog.find((catalogItem) => match(catalogItem, permissionItem));
    if (!baseItem) return [];

    return [
      {
        ...baseItem,
        ...permissionItem,
      },
    ];
  });
}

export default function Modulos() {
  const LOG_MODULE = "dashboard/ui/modulos";
  const NAV_LOG_FILE = "lognavegacion.log";

  const dispatch = useDispatch();
  const router = useRouter();

  const permisos = useSelector(selectPermisos)?.permisos;
  const idModulo = useSelector(selectCurrentModulo);
  const idMenu = useSelector(selectCurrentMenu);
  const idCategoria = useSelector(selectCurrentCategoria);
  const ctx = useSelector(selectcontext) || {};

  const { state } = useSidebar();
  const isSidebarCollapsed = state === "collapsed";

  const modulosFetch = useFetchModulos();
  const menusFetch = useFetchMenus();
  const categoriasFetch = useFetchCategorias();

  /**
   * Estado visual local:
   * - controla qué módulo y menú están abiertos en runtime
   * - NO modifica el current de redux hasta seleccionar una categoría
   */
  const [openModulo, setOpenModulo] = React.useState<number | null>(() => {
    const stored = sessionStorage.getItem("currentModulo");
    return idModulo ? Number(idModulo) : stored ? Number(stored) : null;
  });

  const [openMenu, setOpenMenu] = React.useState<number | null>(() => {
    const stored = sessionStorage.getItem("currentMenu");
    return idMenu ? Number(idMenu) : stored ? Number(stored) : null;
  });
  /**
   * Texto de búsqueda del menú
   */
  const [filter, setFilter] = React.useState("");

  /**
   * Permisos del contexto actual (país / empresa / centro de costo).
   */
  const modulosDePermisos = React.useMemo(
    () =>
      permisos?.paises[ctx?.paisId?.cod_pais as number]?.empresas?.[ctx.empresaId?.cod_empresa as number]?.centrosCosto?.[ctx.centroCostoId?.cod_cc as number]
        ?.modulos ?? {},
    [ctx.centroCostoId, ctx.empresaId, ctx.paisId, permisos?.paises],
  );

  /**
   * Accesores de permisos por módulo / menú.
   */
  const menusDePermisos = React.useCallback(
    (currentModuloId: number) => (!currentModuloId ? {} : (modulosDePermisos?.[currentModuloId]?.menus ?? {})),
    [modulosDePermisos],
  );

  const categoriasDePermisos = React.useCallback(
    (currentModuloId: number, currentMenuId: number) =>
      !currentModuloId || !currentMenuId ? {} : (menusDePermisos(currentModuloId)?.[currentMenuId]?.categorias ?? {}),
    [menusDePermisos],
  );

  /**
   * Categorías procesadas:
   * mezcla catálogo + permisos.
   */
  const categoriasProcesadas = React.useCallback(
    (moduloId: number, menuId: number): Categoria[] =>
      mergeWithCatalog(
        Object.values(categoriasDePermisos(moduloId, menuId)),
        categoriasFetch.data?.items ?? [],
        (base, permission) => base.cod_categoria === permission.cod_categoria,
      ),
    [categoriasDePermisos, categoriasFetch.data?.items],
  );

  /**
   * Menús procesados:
   * mezcla catálogo + permisos y además filtra sus categorías válidas.
   */
  const menusProcesados = React.useCallback(
    (moduloId: number): Menu[] =>
      mergeWithCatalog(Object.values(menusDePermisos(moduloId)), menusFetch.data?.items ?? [], (base, permission) => base.cod_menu === permission.cod_menu).map(
        (menuItem) => ({
          ...menuItem,
          categorias: categoriasProcesadas(moduloId, menuItem.cod_menu).filter((categoria) => !!menuItem.categorias?.[categoria.cod_categoria]),
        }),
      ),
    [menusDePermisos, menusFetch.data?.items, categoriasProcesadas],
  );

  /**
   * Módulos procesados:
   * mezcla catálogo + permisos y además filtra sus menús válidos.
   */
  const modulosProcesados = React.useMemo(
    (): Modulo[] =>
      mergeWithCatalog(Object.values(modulosDePermisos), modulosFetch.data?.items ?? [], (base, permission) => base.cod_modulo === permission.cod_modulo).map(
        (moduloItem) => ({
          ...moduloItem,
          menus: menusProcesados(moduloItem.cod_modulo).filter((menu) => !!moduloItem.menus?.[menu.cod_menu]),
        }),
      ),
    [modulosDePermisos, modulosFetch.data?.items, menusProcesados],
  );

  const isLoading = modulosFetch.isLoading || menusFetch.isLoading || categoriasFetch.isLoading;

  /**
   * Convierte el árbol original (Modulo -> Menu -> Categoria)
   * a una estructura uniforme (TreeItem -> TreeItem -> TreeItem).
   *
   * La ventaja es que, a partir de aquí, todos los niveles comparten:
   * - value
   * - label
   * - icon
   * - children
   *
   * Eso prepara el terreno para poder simplificar el render después.
   */
  const treeItems = React.useMemo(
    (): TreeItem[] =>
      modulosProcesados
        .map((modulo) => ({
          // id normalizado del módulo
          value: modulo.cod_modulo,

          // texto normalizado del módulo
          label: modulo.label,

          // icono normalizado del módulo
          icon: modulo.ico_modulo,

          // ruta normalizada del módulo
          ruta: modulo.modulo_ruta,

          // guardamos el objeto real por si luego necesitamos más datos
          raw: modulo,

          // hijos del módulo = menús
          children: modulo.menus
            ?.map((menu) => ({
              value: menu.cod_menu,
              label: menu.label,
              icon: menu.ico_menu,
              ruta: menu.menu_ruta,
              raw: menu,

              // hijos del menú = categorías
              children: menu.categorias
                ?.map((categoria) => ({
                  value: categoria.cod_categoria,
                  label: categoria.label,
                  icon: categoria.ico_cat,
                  ruta: categoria.ruta_cat,
                  raw: categoria,
                }))
                .sort(sortByText("label")),
            }))
            .sort(sortByText("label")),
        }))
        .sort(sortByText("label")),
    [modulosProcesados],
  );

  /**
   * Filtra el árbol completo manteniendo padres
   * si alguno de sus hijos coincide.
   */
  function filterTree(items: TreeItem[], text: string): TreeItem[] {
    if (!text) return items;

    const query = text.toLowerCase();

    return items
      .map((item) => {
        const children = item.children ? filterTree(item.children, text) : undefined;

        const match = item.label.toLowerCase().includes(query);

        if (match || (children && children.length)) {
          return {
            ...item,
            children,
          };
        }

        return null;
      })
      .filter(Boolean) as TreeItem[];
  }

  const filteredTree = React.useMemo(() => filterTree(treeItems, filter), [treeItems, filter]);

  useSyncNavigationFromPath({
    treeItems,
    setOpenModulo,
    setOpenMenu,
  });

  /**
   * Selección final:
   * aquí sí se actualiza redux porque ya se eligió una categoría.
   */
  const handleSelectCategoria = React.useCallback(
    (modulo: Modulo, menu: Menu, categoria: Categoria) => {
      dispatch(setCurrentModulo(modulo.cod_modulo));
      dispatch(setCurrentModuloName(modulo.nom_modulo));
      dispatch(setCurrentMenu(menu.cod_menu));
      dispatch(setCurrentCategoria(categoria.cod_categoria));
    },
    [dispatch],
  );

  React.useEffect(() => {
    // console.log(idModulo, idMenu);
    // Mantener visualmente abierto lo seleccionado
    setOpenModulo(idModulo ? Number(idModulo) : null);
    setOpenMenu(idMenu ? Number(idMenu) : null);
  }, [idModulo, idMenu]);

  /**
   * Solo un módulo abierto a la vez.
   */
  const handleToggleModulo = React.useCallback(
    (moduloId: number, nextOpen: boolean) => {
      void logGeneralEvent({
        eventName: "toggle_modulo",
        kind: "toggle",
        module: LOG_MODULE,
        fileName: NAV_LOG_FILE,
        extra: { moduloId, nextOpen },
      });

      if (nextOpen) {
        setOpenModulo(moduloId);
        setOpenMenu(null);
        return;
      }

      setOpenModulo((currentOpenModulo) => (currentOpenModulo === moduloId ? null : currentOpenModulo));
      setOpenMenu((currentOpenMenu) => (openModulo === moduloId ? null : currentOpenMenu));
    },
    [openModulo],
  );

  /**
   * Solo un menú abierto a la vez.
   */
  const handleToggleMenu = React.useCallback((moduloId: number, menuId: number, nextOpen: boolean) => {
    void logButtonClick({
      buttonId: "modulos-toggle-menu",
      label: nextOpen ? "Abrir menu" : "Cerrar menu",
      module: LOG_MODULE,
      fileName: NAV_LOG_FILE,
      extra: { moduloId, menuId, nextOpen },
    });

    void logGeneralEvent({
      eventName: "toggle_menu",
      kind: "toggle",
      module: LOG_MODULE,
      fileName: NAV_LOG_FILE,
      extra: { moduloId, menuId, nextOpen },
    });

    if (nextOpen) {
      setOpenModulo(moduloId);
      setOpenMenu(menuId);
      return;
    }

    setOpenMenu((currentOpenMenu) => (currentOpenMenu === menuId ? null : currentOpenMenu));
  }, []);

  /**
   * Wrapper para íconos del árbol.
   */
  const RenderIcon = React.useCallback(({ name }: { name: string }) => <DynamicIcon name={name} className="size-6" />, []);

  /**
   * Renderiza cualquier nodo del árbol:
   * - módulo
   * - menú
   * - categoría
   *
   * Requiere que el árbol ya venga normalizado como TreeItem:
   * {
   *   value,
   *   label,
   *   icon,
   *   children?,
   *   raw
   * }
   */
  const renderItem = (item: TreeItem, parents?: { modulo?: TreeItem; menu?: TreeItem }) => {
    // Si tiene children, puede ser módulo o menú
    const hasChildren = !!item.children?.length;

    // Si no tiene padre módulo, este nodo es un módulo
    const isModulo = !parents?.modulo;

    // Si ya tiene módulo padre y además tiene hijos, este nodo es un menú
    const isMenu = !!parents?.modulo && hasChildren;

    // Si ya tiene módulo y menú padre, y no tiene hijos, este nodo es una categoría
    const isCategoria = !!parents?.modulo && !!parents?.menu && !hasChildren;

    // Estado visual de apertura para módulo o menú
    const isOpen = isModulo ? openModulo === item.value : isMenu ? openModulo === parents.modulo?.value && openMenu === item.value : false;

    // Estado visual de selección para categoría
    const isActive = isCategoria ? idCategoria === item.value : isOpen;

    // Click final de categoría:
    // aquí recuperamos los objetos reales desde raw para seguir usando tu lógica actual
    const handleClickCategoria = () => {
      if (!isCategoria || !parents?.modulo || !parents?.menu) return;

      const modulo = parents.modulo.raw as Modulo;
      const menu = parents.menu.raw as Menu;
      const categoria = item.raw as Categoria;

      void logButtonClick({
        buttonId: "modulos-select-categoria",
        label: "Seleccionar categoria",
        module: LOG_MODULE,
        fileName: NAV_LOG_FILE,
        route: `/dashboard/${parents.modulo.ruta}/${parents.menu.ruta}/${item.ruta}`,
        extra: {
          moduloId: modulo.cod_modulo,
          menuId: menu.cod_menu,
          categoriaId: categoria.cod_categoria,
          moduloNombre: modulo.nom_modulo,
          menuNombre: menu.nom_menu,
          categoriaNombre: categoria.label,
        },
      });

      handleSelectCategoria(modulo, menu, categoria);

      sessionStorage.setItem("currentMenu", parents.menu.value.toString());
      sessionStorage.setItem("currentModulo", parents.modulo.value.toString());
      sessionStorage.setItem("currentModuloName", parents.modulo.label.toString());
      sessionStorage.setItem("currentCategoria", item.value.toString());

      // construir ruta normalizada
      const path = `/dashboard/${parents.modulo.ruta}/${parents.menu.ruta}/${item.ruta}`;

      router.push(path);
    };

    const label = (
      <span>
        {/* {item.label}  */}
        {item.children ? `(${item.children?.length})` : ""}
      </span>
    );

    const hiddenLabel = (
      <span className="truncate group-data-[collapsible=icon]:hidden">
        {/* {item.value}  */}
        {item.label} {item.children ? `(${item.children?.length})` : ""}
      </span>
    );

    // Botón visual único para cualquier nivel
    const button = (
      <Button
        variant={isCategoria ? "link" : "ghost"}
        size="sm"
        className={cn(
          "w-full justify-start gap-2 transition-none hover:bg-accent hover:text-accent-foreground text-primary-foreground",
          !isCategoria && "p-0",
          isActive && ACTIVE_CLASS,
          isActive && (isModulo ? "sticky top-0" : isMenu ? "sticky top-0" : isCategoria ? "sticky top-0" : ""),
        )}
        onClick={isCategoria ? handleClickCategoria : undefined}
      >
        {hasChildren && <ChevronRightIcon className={cn("shrink-0 transition-transform", isOpen && "rotate-90")} />}
        <RenderIcon name={item.icon ?? ""} />
        <span className="truncate group-data-[collapsible=icon]:hidden">{hiddenLabel}</span>
      </Button>
    );
    // Caso categoría:
    // no usa Collapsible, solo botón / tooltip
    if (isCategoria) {
      if (!isSidebarCollapsed) {
        return <div key={`CA_${item.value}`}>{button}</div>;
      }

      return (
        <Tooltip key={`CA_${item.value}`}>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{hiddenLabel}</TooltipContent>
        </Tooltip>
      );
    }

    const collapsibleTrigger = <CollapsibleTrigger asChild>{button}</CollapsibleTrigger>;

    const collapsibleTriggerToottip = (
      <Tooltip key={`${isModulo ? "MO" : "ME"}_TT_${item.value}`}>
        <TooltipTrigger asChild>{collapsibleTrigger}</TooltipTrigger>
        <TooltipContent side="right">{hiddenLabel}</TooltipContent>
      </Tooltip>
    );

    // Caso módulo o menú:
    // usan Collapsible y se llaman recursivamente a sí mismos
    return (
      <Collapsible
        key={`${isModulo ? "MO" : "ME"}_${item.value}`}
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (isModulo) {
            handleToggleModulo(item.value, nextOpen);
            return;
          }

          if (isMenu && parents?.modulo) {
            handleToggleMenu(parents.modulo.value, item.value, nextOpen);
          }
        }}
      >
        {!isSidebarCollapsed ? collapsibleTrigger : collapsibleTriggerToottip}

        <CollapsibleContent className={cn("mt-1 ml-5 overflow-hidden style-lyra:ml-4", isMenu && " scroll")}>
          <div className="flex flex-col gap-1">
            {item.children?.map((child) => renderItem(child, isModulo ? { modulo: item } : { modulo: parents?.modulo, menu: item }))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  if (isLoading) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="mx-auto w-full h-full overflow-hidden">
        {!isSidebarCollapsed && (
          <div className="mb-2 bg-background rounded-sm">
            <InputField
              type="text"
              id="filtro"
              label=""
              value={filter}
              onChange={(value) => {
                setFilter(value);
                void logGeneralEvent({
                  eventName: "modulos_filter_change",
                  kind: "input_change",
                  module: LOG_MODULE,
                  fileName: NAV_LOG_FILE,
                  extra: { valueLength: value.length },
                });
              }}
              placeholder="Buscar..."
            />
          </div>
        )}
        <SidebarSeparator className="py-2" />
        {/* <pre>{JSON.stringify(modulosProcesados, null, 2)}</pre> */}
        <div className="flex flex-col space-y-2 h-[90%] scroll">{filteredTree.map((item) => renderItem(item))}</div>
      </div>
    </TooltipProvider>
  );
}
