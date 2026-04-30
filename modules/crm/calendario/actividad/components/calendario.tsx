"use client";

import * as React from "react";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar1, Circle, Download, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Actividad2 } from "@/types/crm/actividades2";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AutoCompleteField from "@/components/custom/form/autoCompleteField";
import { DropdownProps } from "react-day-picker";
import { es } from "date-fns/locale";

type DayPickerDropdownOption = NonNullable<DropdownProps["options"]>[number];

const formatter = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const formatterDay = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
});

function CalendarDropdown(props: DropdownProps) {
  const { options = [], value, onChange, disabled, "aria-label": ariaLabel } = props;

  const selected = options.find((option) => String(option.value) === String(value)) ?? null;

  return (
    <AutoCompleteField<DayPickerDropdownOption>
      id={ariaLabel ?? "calendar-dropdown"}
      label=""
      options={options}
      value={selected}
      readOnly={disabled}
      clearable={false}
      placeholder={ariaLabel ?? "Seleccionar..."}
      getOptionValue={(option) => option.value}
      getOptionLabel={(option) => String(option.label)}
      onChange={(option) => {
        if (!option) return;

        onChange?.({
          target: {
            value: String(option.value),
          },
        } as React.ChangeEvent<HTMLSelectElement>);
      }}
      fieldProps={{
        className: "w-[140px]",
      }}
      comboboxContentProps={{
        className: "overflow-auto",
      }}
    />
  );
}

type Props = {
  actividades: Partial<Actividad2>[];
  setMonth: (date: Date) => void;
  month: Date | undefined;
  onDayClick: (day: Date) => void;
  trackTableButton: (action: string, label: string, extra?: Record<string, unknown>) => void;
};

export const Calendario = ({ actividades, onDayClick, trackTableButton, setMonth, month }: Props) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  // const [month, setMonth] = React.useState<Date>(new Date());

  const setDay = (day: Date) => {
    setMonth(day); // Cambia la vista del mes
    setDate(day); // Selecciona el día (opcional)
    if (trackTableButton) trackTableButton("clic-day", formatterDay.format(day), { fecha: formatter.format(day) });
  };

  const handleGoToToday = () => {
    const today = new Date();
    setMonth(today); // Cambia la vista del mes
    setDate(today); // Selecciona el día (opcional)
    if (trackTableButton) trackTableButton("click-today", "Ir a Hoy", { fecha: formatter.format(today) });
  };

  // devolver dia seleccionado
  React.useEffect(() => {
    if (date && onDayClick) onDayClick(date);
  }, [date, onDayClick]);

  const actividadesByDay = React.useMemo(() => {
    const mapaPorFecha = actividades.reduce(
      (acc, actividad) => {
        const key = formatter.format(new Date(actividad.fecha_programada || ""));

        (acc[key] ??= []).push(actividad);

        return acc;
      },
      {} as Record<string, typeof actividades>,
    );

    return mapaPorFecha;
  }, [actividades]);

  return (
    <>
      <Calendar
        mode="single"
        captionLayout="dropdown"
        onDayClick={setDay}
        numberOfMonths={1}
        weekStartsOn={1}
        locale={es}
        classNames={{
          day: "h-10 w-full",
          day_selected: "h-10 w-full",
          day_button: "h-10 w-full",
        }}
        today={new Date()}
        selected={date}
        onSelect={setDate}
        month={month}
        onMonthChange={setMonth}
        className={
          cn("w-full")
          // "[--cell-size:--spacing(20)] md:[--cell-size:--spacing(20)]",
        }
        footer={
          <div className="flex flex-row">
            <Button className="mx-auto mt-4 flex items-center gap-2 bg-transparent border border-primary text-foreground">
              <Plus /> Agregar Actividad
            </Button>
            <Button className="mx-auto mt-4 flex items-center gap-2 bg-transparent border border-primary text-foreground" onClick={handleGoToToday}>
              Ir a Hoy <Calendar1 />
            </Button>
            <Button className="mx-auto mt-4 flex items-center gap-2 bg-transparent border border-primary text-foreground">
              <Download />
            </Button>
          </div>
        }
        formatters={{
          formatMonthDropdown: (date) => {
            return date.toLocaleString("default", { month: "long" }).toUpperCase();
          },
          formatYearDropdown: (date) => {
            return date.toLocaleString("default", { year: "numeric" });
          },
        }}
        components={{
          Dropdown: CalendarDropdown,

          DayButton: ({ children, modifiers, day, ...props }) => {
            const formatted = formatter.format(day.date);
            const actividadesDelDia = actividadesByDay[formatted] || [];
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;

            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CalendarDayButton day={day} modifiers={modifiers} {...props} className={cn(props.className, isWeekend ? "bg-muted" : null)}>
                    {children}
                    {actividadesDelDia.length > 1 ? (
                      <div className="p-2 px-4 rounded-full bg-secondary" />
                    ) : actividadesDelDia.length ? (
                      <div className="p-2 rounded-full bg-secondary" />
                    ) : null}
                  </CalendarDayButton>
                </TooltipTrigger>
                {actividadesDelDia.length ? <TooltipContent>No. Actividades ({actividadesDelDia.length})</TooltipContent> : null}
              </Tooltip>
            );
          },
        }}
      />
    </>
  );
};
