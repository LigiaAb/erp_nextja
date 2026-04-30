import { EditableTable } from "@/components/custom/Table";
import { Card, CardHeader } from "@/components/ui/card";
import { Actividad2 } from "@/types/crm/actividades2";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import DynamicIcon from "@/components/custom/DynamicIcon";
import { Calendario } from "../components/calendario";
import { CustomComponentMetadata, EditableColumn } from "@/types/components/table";
import { ConfiguracionActividad } from "@/types/configuracion/configuracion_actividad";
import { logButtonClick } from "@/lib/logs/logButtonClick";
import { formatDateToText } from "../lib/helpperDates";
import { useSelector } from "react-redux";
import { selectAuth } from "@/store/auth/authSlice";
import { iconos_actividad } from "../lib/hellperActividades";
import { ConteoActividades } from "@/types/crm/conteo_actividades";

const colClass = "w-1/3 px-1";

const formatter = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const metadata: CustomComponentMetadata = {
  module: "CRM",
  fileName: "crm.log",
  route: "dashboard/crm/calendario/actividad",
};

const trackTableButton = (action: string, label: string, extra?: Record<string, unknown>) => {
  void logButtonClick({
    buttonId: `actividades-component:${action}`,
    label,
    module: metadata.module,
    route: metadata.route,
    fileName: metadata.fileName ?? "logbotones.log",
    extra,
  });
};

interface BotonFiltroProps {
  color?: string;
  text?: string;
  cantidad?: number;
  icon?: string;
  activo?: boolean;
  onClick?: (...args: unknown[]) => unknown;
}

const BotonFiltro = (props: BotonFiltroProps) => {
  return (
    <Card
      className={cn(
        "flex flex-row border-2 border-primary relative cursor-pointer rounded-md p-2 items-center",
        props.activo ? "border-primary" : "border-muted",
      )}
      onClick={props.onClick}
    >
      {props.activo && <div className="absolute top-0 left-0 w-0 h-0 border-t-14 border-t-primary border-r-14 border-r-transparent rounded-tl-sm" />}
      {props.icon ? <DynamicIcon style={{ color: props.color }} name={props.icon} size={15} className={cn("ml-1")} /> : null}
      <div className="text-right w-full">
        <div className="text-[8px]">{props.text}</div>
        <div className="">{props.cantidad ?? 0}</div>
      </div>
    </Card>
  );
};

interface Props {
  setDate: (date: Date) => void;
  date: Date | undefined;
  setMonth: (date: Date) => void;
  month: Date | undefined;
  setFiltros: (filtros: Record<string, boolean>) => void;
  filtros: Record<string, boolean>;

  configuraciones: ConfiguracionActividad[];
  actividades: Actividad2[];
  actividadesCalendario: Partial<Actividad2>[];

  conteo: ConteoActividades;
}

const CalendarioView = ({ setDate, date, setFiltros, filtros, configuraciones, actividadesCalendario, actividades, setMonth, month, conteo }: Props) => {
  const auth = useSelector(selectAuth);

  const columns: EditableColumn<Actividad2>[] = [
    { id: "cod_actividad", header: "#", type: "number", align: "left", placeholder: "Código" },
    {
      id: "cod_estado",
      header: "",
      type: "text",
      align: "left",
      placeholder: "",
      format(value, row) {
        return (
          <div className="flex flex-row space-x-2 justify-center">
            <DynamicIcon size={12} name={iconos_actividad[row.nom_tipo] || "Mail"} />
            <div className={cn("p-1 rounded-full border", row.estado_desc === "EN PROCESO" ? "border-green-700" : "border-red-700")}>
              <div className={cn("p-1 rounded-full", row.estado_desc === "EN PROCESO" ? "bg-green-700" : "bg-red-700")} />
            </div>
          </div>
        );
      },
    },
    { id: "asunto", header: "Asunto", type: "text", align: "left", placeholder: "Asunto" },
  ];

  return (
    <div>
      <Accordion type="single" collapsible defaultValue="filtro">
        <AccordionItem value="filtro">
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              data-slot="accordion-trigger"
              className="focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center gap-4 rounded-md p-2 text-left text-sm font-medium transition-all outline-none bg-primary text-primary-foreground focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-90 [&[data-state=open]>svg>path:last-child]:rotate-90 "
            >
              <ChevronDown className="" />
              Filtro
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5 p-2">
              <Card className="p-2 w-full">
                <div className="w-full">Estado</div>
                <div className="flex flex-wrap justify-center space-y-3">
                  {/* DINAMICO */}
                  <div className={colClass}>
                    <BotonFiltro
                      onClick={() => setFiltros({ ...filtros, proceso: !filtros.proceso })}
                      activo={filtros.proceso}
                      text="EN PROCESO"
                      icon="circle"
                      color={"green"}
                      cantidad={conteo.estados["en proceso"]}
                    />
                  </div>
                  <div className={colClass}>
                    <BotonFiltro
                      onClick={() => setFiltros({ ...filtros, finalizado: !filtros.finalizado })}
                      activo={filtros.finalizado}
                      text="FINALIZADO"
                      icon="circle"
                      color={"red"}
                      cantidad={conteo.estados["finalizado"]}
                    />
                  </div>
                  {/* FIN DINAMICO */}
                </div>
              </Card>
              <Card className="p-2">
                <div className="w-full text-right">Tipos de Actividades</div>
                <div className="flex flex-wrap justify-center space-y-3">
                  {configuraciones.map((item) => (
                    <div key={item.cod_configuracion_actividad} className={colClass}>
                      <BotonFiltro
                        onClick={() => setFiltros({ ...filtros, [`${item.cod_tipo_actividad}`]: !filtros[item.cod_tipo_actividad] })}
                        activo={filtros[item.cod_tipo_actividad]}
                        icon={item.icono}
                        color={item.color}
                        text={item.nom_tipo_actividad}
                        cantidad={conteo.tipos[item.nom_tipo_actividad.toLowerCase()]}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        <Calendario onDayClick={setDate} setMonth={setMonth} month={month} actividades={actividadesCalendario || []} trackTableButton={trackTableButton} />
        <div className="md:col-span-2 flex flex-col">
          <div className="bg-linear-to-r from-primary to- to-80% to-muted border p-2 rounded-2xl mb-5 grid grid-cols-2">
            <span className="text-primary-foreground">
              Actividades para {auth.nombre_completo} ({actividades.length})
            </span>
            <span className="text-right">{date ? formatDateToText(date) : null}</span>
          </div>
          <EditableTable<Actividad2>
            className=""
            columns={columns}
            data={actividades}
            getRowId={(r) => r.cod_actividad}
            metadata={metadata}
            actions={{ showBackColumn: false, frontOrder: ["open"] }}
            onOpen={() => {}}
            initialPageSize={5}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarioView;
