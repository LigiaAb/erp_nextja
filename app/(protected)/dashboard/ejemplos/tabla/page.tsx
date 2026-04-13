"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { EditableTable } from "@/components/custom/Table";
import type { EditableColumn } from "@/types/components/table";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  edad: number;
  activo: boolean;
  rol: string;
  ingreso: string;
  estado: {
    code: string;
    label: string;
    color: "green" | "yellow" | "red";
  };
  saldo: number;
};

const initialData: Usuario[] = [
  {
    id: 1,
    nombre: "Ligia Abril",
    correo: "ligia@empresa.com",
    edad: 28,
    activo: true,
    rol: "admin",
    ingreso: "2026-03-01",
    estado: { code: "A", label: "Activo", color: "green" },
    saldo: 4500,
  },
  {
    id: 2,
    nombre: "María López",
    correo: "maria@empresa.com",
    edad: 34,
    activo: false,
    rol: "user",
    ingreso: "2026-02-14",
    estado: { code: "P", label: "Pendiente", color: "yellow" },
    saldo: -120,
  },
  {
    id: 3,
    nombre: "Juan Pérez",
    correo: "juan@empresa.com",
    edad: 31,
    activo: true,
    rol: "supervisor",
    ingreso: "2026-01-20",
    estado: { code: "B", label: "Bloqueado", color: "red" },
    saldo: 0,
  },
  {
    id: 4,
    nombre: "Juan Pérez",
    correo: "juan@empresa.com",
    edad: 31,
    activo: true,
    rol: "supervisor",
    ingreso: "2026-01-20",
    estado: { code: "B", label: "Bloqueado", color: "red" },
    saldo: 0,
  },
  {
    id: 5,
    nombre: "Juan Pérez",
    correo: "juan@empresa.com",
    edad: 31,
    activo: true,
    rol: "supervisor",
    ingreso: "2026-01-20",
    estado: { code: "B", label: "Bloqueado", color: "red" },
    saldo: 0,
  },
];

const columns: EditableColumn<Usuario>[] = [
  {
    id: "nombre",
    header: "Nombre",
    type: "text",
    editable: true,
    required: true,
    align: "left",
    placeholder: "Nombre",
  },
  {
    id: "correo",
    header: "Correo",
    type: "text",
    editable: true,
    required: true,
    align: "left",
    placeholder: "correo@empresa.com",
  },
  {
    id: "edad",
    header: "Edad",
    type: "number",
    editable: true,
    required: true,
    align: "right",
  },
  {
    id: "activo",
    header: "Activo",
    type: "checkbox",
    editable: true,
    align: "center",
  },
  {
    id: "rol",
    header: "Rol",
    type: "select",
    editable: true,
    required: true,
    align: "left",
    options: [
      { label: "Administrador", value: "admin" },
      { label: "Usuario", value: "user" },
      { label: "Supervisor", value: "supervisor" },
    ],
  },
  {
    id: "ingreso",
    header: "Ingreso",
    type: "date",
    editable: false,
    align: "left",
  },
  {
    id: "estado",
    header: "Estado",
    align: "left",
    format: (value) => {
      if (!value || typeof value !== "object" || !("label" in value) || !("color" in value)) {
        return null;
      }

      const tone =
        value.color === "green"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          : value.color === "yellow"
            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

      return <Badge className={tone}>{String(value.label)}</Badge>;
    },
  },
  {
    id: "saldo",
    header: "Saldo",
    type: "number",
    align: "right",
    textClassName: (value) => (typeof value === "number" ? (value < 0 ? "text-red-600 dark:text-red-400" : value > 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground") : undefined),
    format: (value) => {
      if (typeof value !== "number") return "";
      return value.toLocaleString("es-GT", {
        style: "currency",
        currency: "GTQ",
      });
    },
  },
];

export default function EjemploTablaPage() {
  const [rows, setRows] = React.useState<Usuario[]>(initialData);

  return (
    <main className="p-4">
      <EditableTable<Usuario>
        metadata={{
          module: "dashboard/ejemplos/tabla",
          fileName: "logbotones.log",
        }}
        title="Usuarios"
        allowCreate
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        compact
        searchable
        searchPlaceholder="Buscar usuario..."
        actions={{
          frontOrder: ["open", "edit"],
          backOrder: ["delete"],
          enabled: {
            open: true,
            edit: true,
            delete: true,
            copy: true,
            download: true,
            mail: true,
            auth: (row) => row.rol === "admin",
            pdf: true,
            print: true,
            kanban: true,
          },
          tooltips: {
            open: "Abrir (Ctrl/Cmd + click = nueva pestaña)",
            auth: "Autorizar registro",
          },
        }}
        onSave={async (rowId, updatedRow) => {
          setRows((prev) => prev.map((row) => (row.id === rowId ? updatedRow : row)));
          console.log("Guardar fila:", rowId, updatedRow);
        }}
        onDelete={async (rowId) => {
          setRows((prev) => prev.filter((row) => row.id !== rowId));
          console.log("Eliminar fila:", rowId);
        }}
        onOpen={(rowId, row, ctx) => {
          if (ctx.newTab) {
            console.log("Abrir en nueva pestaña:", rowId, row);
            return;
          }

          console.log("Abrir en misma pantalla:", rowId, row);
        }}
        onCopy={(rowId, row) => {
          console.log("Copiar:", rowId, row);
        }}
        onDownload={(rowId, row) => {
          console.log("Descargar:", rowId, row);
        }}
        onMail={(rowId, row) => {
          console.log("Mail:", rowId, row);
        }}
        onAuth={(rowId, row) => {
          console.log("Auth:", rowId, row);
        }}
        onPdf={(rowId, row) => {
          console.log("PDF:", rowId, row);
        }}
        onPrint={(rowId, row) => {
          console.log("Print:", rowId, row);
        }}
        onKanban={(rowId, row) => {
          console.log("Kanban:", rowId, row);
        }}
        onEditStart={(rowId, row) => {
          console.log("Editando:", rowId, row);
        }}
        onRowClick={(rowId, row) => {
          console.log("Click fila:", rowId, row);
        }}
      />
    </main>
  );
}
