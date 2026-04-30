"use client";

import React from "react";
import { useFetchActividades2, useFetchConteoActividades } from "../../../../../fetch/crm/calendario";
import { useSelector } from "react-redux";
import { getCurrentUser } from "@/store/auth/authSlice";
import { useFetchConfiguracionesActividad } from "@/fetch/configuracion/catalogos";
import { selectcontext } from "@/store/context/contextSlice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { selectNavigation } from "@/store/navigation/navigationSlice";
import { selectPermisos } from "@/store/permisos/permisosSlice";
import CalendarioView from "./calendario.view";
import { useFetchEmpleadoXUsuarioXPuesto } from "@/fetch/configuracion/puestos";
import { EmpleadoXUsuarioXPuesto } from "@/types/configuracion";
import AutoCompleteField from "@/components/custom/form/autoCompleteField";
import { ConteoActividades } from "@/types/crm/conteo_actividades";

const formatter = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

const Actividades = () => {
  const ctx = useSelector(selectcontext);
  const cod_usuario = useSelector(getCurrentUser);
  const navegacion = useSelector(selectNavigation);
  const permisos = useSelector(selectPermisos);

  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(new Date());

  const { start: startDate, end: endDate } = React.useMemo(() => getMonthRange(month || new Date()), [month]);

  const actividades2Fetch = useFetchActividades2({ cod_asesor: cod_usuario });
  const configuracionActividadFetch = useFetchConfiguracionesActividad({ cod_cc: ctx?.centroCostoId?.cod_cc, cod_estado: 1 });
  // const usuariosFetch = useFetchEmpleadoXUsuarioXPuesto({ cod_cc: ctx?.centroCostoId?.cod_cc });
  const conteoActividades = useFetchConteoActividades({
    cod_usuario: cod_usuario,
    fecha_inicial: startDate.toISOString(),
    fecha_final: endDate.toISOString(),
  });

  const configuracionActividad = React.useMemo(() => configuracionActividadFetch.data?.items ?? [], [configuracionActividadFetch.data?.items]);

  const [filtros, setFiltros] = React.useState<{ [key: string]: boolean }>({ proceso: true, finalizado: true });

  const [currentTab, setCurrentTab] = React.useState<string>("");

  const opcionesDeOpcion = React.useMemo(
    () =>
      Object.values(
        permisos?.permisos.paises[ctx?.paisId?.cod_pais ?? 0]?.empresas?.[ctx?.empresaId?.cod_empresa ?? 0]?.centrosCosto?.[ctx?.centroCostoId?.cod_cc ?? 0]
          ?.modulos?.[navegacion?.currentModulo ?? 0]?.menus?.[navegacion?.currentMenu ?? 0]?.categorias?.[navegacion?.currentCategoria ?? 0]?.opciones || {},
      ).filter((i) => i.nivel_opcion === "E"),
    [ctx, navegacion, permisos],
  );

  const actividadesFiltradas = React.useMemo(() => {
    return actividades2Fetch.data?.items
      .filter((item) => {
        return (filtros.proceso && item.estado_desc === "EN PROCESO") || (filtros.finalizado && item.estado_desc === "FINALIZADO");
      })
      .filter((item) => {
        return filtros[`${item.cod_tipo}`];
      });
  }, [filtros, actividades2Fetch.data?.items]);

  const actividadesParaCalendario = React.useMemo(() => {
    return (actividadesFiltradas || []).map((item) => ({ fecha_programada: item.fecha_programada }));
  }, [actividadesFiltradas]);

  const actividadesByDate = React.useMemo(() => {
    return (actividadesFiltradas || []).filter((item) => formatter.format(new Date(item.fecha_programada)) === formatter.format(date));
  }, [actividadesFiltradas, date]);

  // const usuariosParaValidacion = React.useMemo(() => {
  //   return ((usuariosFetch.data?.items || []) as EmpleadoXUsuarioXPuesto[]).reduce((arr: EmpleadoXUsuarioXPuesto[], item) => {
  //     if (arr.some((i: EmpleadoXUsuarioXPuesto) => i.cod_empleado === item.cod_empleado)) return arr;
  //     return [...arr, item];
  //   }, []);
  // }, [usuariosFetch.data?.items]);

  React.useEffect(() => {
    actividades2Fetch.refetch();
  }, [cod_usuario]);

  React.useEffect(() => {
    conteoActividades.refetch();
  }, [cod_usuario, startDate, endDate]);

  React.useEffect(() => {
    configuracionActividadFetch.refetch();
  }, [ctx]);

  React.useEffect(() => {
    if (!configuracionActividad) return;

    configuracionActividad.forEach((item) => setFiltros((filtros) => ({ ...filtros, [item.cod_tipo_actividad]: true })));
  }, [configuracionActividad]);

  React.useEffect(() => {
    if (!opcionesDeOpcion.length) return;

    setCurrentTab(`${opcionesDeOpcion[0].cod_opcion}`);
  }, [opcionesDeOpcion]);

  return (
    <div>
      {/* {ctx?.centroCostoId?.cod_cc === 2 && (
        <AutoCompleteField<EmpleadoXUsuarioXPuesto>
          id="usuario"
          label="Usuario"
          value={null}
          options={usuariosParaValidacion}
          onChange={() => {}}
          getOptionLabel={(v) => v.label}
          getOptionValue={(v) => v.value}
        />
      )} */}
      {opcionesDeOpcion.length > 0 && (
        <Tabs value={`${currentTab}`} onValueChange={setCurrentTab} className="mb-5">
          <TabsList className="h-fit">
            {opcionesDeOpcion.map((item) => (
              <TabsTrigger key={item.cod_opcion} value={`${item.cod_opcion}`} className="p-5">
                <span className="p-5">{item.nom_opcion}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      {currentTab === `${opcionesDeOpcion?.[0]?.cod_opcion}` ? (
        <CalendarioView
          {...{ month, setMonth, setDate, date, setFiltros, filtros }}
          configuraciones={configuracionActividad}
          actividadesCalendario={actividadesParaCalendario}
          actividades={actividadesByDate}
          conteo={conteoActividades.data?.data || ({ total: 0, tipos: {}, estados: {} } as ConteoActividades)}
        />
      ) : null}
      {/* <pre>{JSON.stringify({ startDate, endDate }, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(conteoActividades.data?.data, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(usuariosParaValidacion, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(navegacion, null, 2)}</pre> */}
      {/* <pre>
        {JSON.stringify(
          Object.values(
            permisos?.permisos.paises[ctx?.paisId?.cod_pais ?? 0]?.empresas?.[ctx?.empresaId?.cod_empresa ?? 0]?.centrosCosto?.[ctx?.centroCostoId?.cod_cc ?? 0]
              ?.modulos?.[navegacion?.currentModulo ?? 0]?.menus?.[navegacion?.currentMenu ?? 0]?.categorias?.[navegacion?.currentCategoria ?? 0]?.opciones ||
              {},
          ).filter((i) => i.nivel_opcion === "E"),
          null,
          2,
        )}
      </pre> */}
      {/* <pre>{JSON.stringify(permisos, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(filtros, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(configuracionActividad, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(date, null, 2)}</pre> */}
      {/* <pre>
        {JSON.stringify(
          actividades2Fetch.data?.items.filter((i) => formatter.format(new Date(i.fecha_programada)) === formatter.format(date)),
          null,
          2,
        )}
      </pre> */}
    </div>
  );
};

export default Actividades;
