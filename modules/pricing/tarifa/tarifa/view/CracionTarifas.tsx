"use client";

import React from "react";
import TarifaFormulario from "../components/tarifaFormulario";
import { DrawerContent, DrawerTrigger, Drawer } from "@/components/ui/drawer";
import { EditableTable } from "@/components/custom/Table";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { CatalogMetodo, CatalogServicio, useFetchServicios } from "@/fetch/pricing/tarifas";
import { EditableColumn } from "@/types/components/table";
import { Servicio } from "@/types/configuracion";
import { useFetchRubros, useFetchTipos } from "@/fetch/configuracion/catalogos";
import useCatalogosTarifa from "../hooks/useCatalogosTarifas";
import { CATALOGOS_AGREGAR_TODOS, DEFAULT_TODOS_VALUE, setServicioBase } from "../lib/tarifaHelppers";
import { useSelector } from "react-redux";
import { selectcontext } from "@/store/context/contextSlice";
import { LoaderSvg } from "@/components/loader";

const obligatoriosInsertar = [
  "empresa",
  "centroCosto",
  "rubro",
  "proveedor",
  "servicio",
  "tipoTransporte",
  "tipoServicio",
  "tipoCarga",
  "clasificacioncarga",
  "tipoPago",
  "",
];

const gruposDeFiltro = ["alcance", "vigencia"];

const camposDeFiltro = [
  "usuario",
  "nombre",
  "siglas",
  "obligatorio",
  "incoterm",
  "metodoCalculo",
  "aplicaOrigenesDestinos",
  "aplicaCommodities",
  "tipoTarifa",
  "fechaInicio",
  "fechaFin",
  "fechaCreacion",
  "fechaModificacion",
  "usuario",
];

const CracionTarifas = () => {
  const ctx = useSelector(selectcontext);
  const [openFiltro, setOpenFiltro] = React.useState(false);
  const [filtroAnulados, setFiltroAnulados] = React.useState(false);
  const serviciosFetch = useFetchServicios({});

  const [elementoSeleccionado, setElementoSeleccionado] = React.useState<(Servicio & Partial<CatalogMetodo>) | null>(null);
  const [accion, setAccion] = React.useState<"ingreso" | "edicion">("ingreso");
  const [loading, setLoading] = React.useState(false);

  const {
    catalogos,
    isLoading: isLoadingCatalogos,
    fetchMetodoByServicio,
  } = useCatalogosTarifa({
    // Opcional: agregar TODOS a ciertos catálogos
    agregarTodos: {
      default: DEFAULT_TODOS_VALUE,
      catalogos: CATALOGOS_AGREGAR_TODOS,
    },
  });

  const isLoading = React.useMemo(() => isLoadingCatalogos || serviciosFetch.isLoading || loading, [isLoadingCatalogos, serviciosFetch.isLoading, loading]);

  const columns: EditableColumn<CatalogServicio>[] = [
    {
      id: "cod_servicio",
      header: "Codigo",
      type: "number",
      editable: false,
      align: "left",
      placeholder: "Codigo",
    },
    {
      id: "label",
      header: "Nombre",
      type: "text",
      editable: false,
      align: "left",
      placeholder: "Nombre",
    },
    {
      id: "cod_rubro",
      header: "Rubro",
      type: "text",
      editable: false,
      align: "left",
      placeholder: "Rubro",
      textClassName: (value) => (value === null || !catalogos.rubros.find((r) => r.value === value) ? "text-gray-500" : undefined),
      format: (value) => catalogos.rubros.find((r) => r.value === value)?.nombre ?? "rubro no encontrado",
    },
    {
      id: "cod_tipo_servicio",
      header: "Tipo de Servicio",
      type: "text",
      editable: false,
      align: "left",
      placeholder: "Tipo de Servicio",
      textClassName: (value) => (value === null ? "text-gray-500" : undefined),
      format: (value) => catalogos.tiposServicio.find((r) => r.value === value)?.label ?? "",
    },
    {
      id: "cod_tipo_aplicacion",
      header: "Tipo de Aplicacion",
      type: "text",
      editable: false,
      align: "left",
      placeholder: "Tipo de Aplicacion",
      textClassName: (value) => (value === null ? "text-gray-500" : undefined),
      format: (value) => catalogos.tiposAplicacion.find((r) => r.value === value)?.label ?? "",
    },
  ];

  const serviciosFiltrados = React.useMemo(
    () => serviciosFetch.data?.items.filter((s) => s.cod_estado === (filtroAnulados ? 2 : 1)),
    [serviciosFetch.data?.items, filtroAnulados],
  );

  const setMetodoSeleccionado = async (id: string | number, row: CatalogServicio) => {
    setLoading(true);
    const metodo = await fetchMetodoByServicio(Number(id));

    setElementoSeleccionado({ ...metodo, ...row });
    setAccion("edicion");
    setLoading(false);
  };

  const refetch = () => {
    void serviciosFetch.refetch();
  };

  const setNuevo = () => {
    setLoading(true);
    const metodo: Partial<CatalogMetodo> = {};
    const row: Servicio = setServicioBase(ctx);

    setElementoSeleccionado({ ...metodo, ...row });
    setAccion("ingreso");
    setLoading(false);
  };

  React.useEffect(() => {
    void serviciosFetch.refetch();
  }, [ctx]);

  React.useEffect(() => {
    void serviciosFetch.refetch();
  }, []);

  return (
    <div className="py-5 " key={JSON.stringify(ctx)}>
      <EditableTable<CatalogServicio>
        columns={columns}
        data={serviciosFiltrados || []}
        getRowId={(r) => r.cod_servicio}
        metadata={{ module: "Pricing" }}
        actions={{
          frontOrder: ["open"],
          backOrder: ["delete"],
          enabled: {
            open: true,
            delete: (row) => {
              return row.cod_estado === 1; // tu condición
            },
          },
        }}
        onOpen={setMetodoSeleccionado}
        headerActions={[
          {
            id: "filtrar_activos",
            label: filtroAnulados ? "Mostrar Activos" : "Mostrar Anulados",
            variant: "outline",
            onClick: () => setFiltroAnulados((prev) => !prev),
          },
          {
            id: "sincronizar",
            label: "Sincronizar",
            variant: "outline",
            onClick: refetch,
          },
          {
            id: "filtro",
            label: "Filtrar",
            variant: "secondary",
            onClick: () => setOpenFiltro(true),
          },
          {
            id: "nuevo",
            label: "Nuevo",
            onClick: () => setNuevo(),
          },
        ]}
      />
      <Drawer direction="right" modal={false} open={openFiltro} onOpenChange={setOpenFiltro}>
        {openFiltro && (
          <DrawerTrigger asChild>
            <Button variant="outline">Filtrar</Button>
          </DrawerTrigger>
        )}

        <DrawerContent className="pointer-events-auto z-50 py-5" onClick={(e) => e.stopPropagation()}>
          <DialogTitle className="px-5">Filtrar por:</DialogTitle>
          <TarifaFormulario tipoFormulario="filtro" inputsToHide={camposDeFiltro} groupsToHide={gruposDeFiltro} />
        </DrawerContent>
      </Drawer>
      <div className="relative">
        {isLoading && (
          <div className="w-full h-full bg-muted/50 absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center flex">
            <LoaderSvg className="" />
          </div>
        )}
        {elementoSeleccionado && (
          <div className="grid grid-cols-2 gap-2 border border-accent p-2 rounded-md mt-5 shadow-xl">
            <p>
              <span className="font-serif ">
                SERVICIO
                <sup>({elementoSeleccionado?.value ?? ""})</sup>
              </span>{" "}
              {accion == "ingreso" ? "Nuevo" : (elementoSeleccionado?.label ?? "")}
            </p>
            <p className="text-right text-sm">Modo {accion}</p>
          </div>
        )}
        {elementoSeleccionado && (
          <TarifaFormulario
            key={elementoSeleccionado?.cod_servicio ?? ""}
            tipoFormulario="ingreso"
            obligatorios={obligatoriosInsertar}
            defaultValues={elementoSeleccionado ?? undefined}
          />
        )}
      </div>
    </div>
  );
};

export default CracionTarifas;
