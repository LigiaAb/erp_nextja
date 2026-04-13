"use client";

import * as React from "react";
import { EditableTable } from "@/components/custom/Table";
import { StepItem, StepperRoot } from "@/components/custom/Stepper";
import AutoCompleteField from "@/components/custom/form/autoCompleteField";
import InputField from "@/components/custom/form/inputField";
import type { EditableColumn } from "@/types/components/table";

type DemoRow = {
  id: number;
  nombre: string;
  activo: boolean;
};

type DemoOption = {
  code: number;
  label: string;
};

const tableColumns: EditableColumn<DemoRow>[] = [
  {
    id: "id",
    header: "ID",
    type: "number",
    editable: false,
    align: "right",
  },
  {
    id: "nombre",
    header: "Nombre",
    type: "text",
    editable: true,
    required: true,
    placeholder: "Nombre",
  },
  {
    id: "activo",
    header: "Activo",
    type: "checkbox",
    editable: true,
    align: "center",
  },
];

const options: DemoOption[] = [
  { code: 1, label: "Alta prioridad" },
  { code: 2, label: "Media prioridad" },
  { code: 3, label: "Baja prioridad" },
];

export function CustomComponentsDemos() {
  const [rows, setRows] = React.useState<DemoRow[]>([
    { id: 1, nombre: "Registro A", activo: true },
    { id: 2, nombre: "Registro B", activo: false },
  ]);
  const [step, setStep] = React.useState("datos");
  const [text, setText] = React.useState("");
  const [selected, setSelected] = React.useState<DemoOption | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium">Stepper Demo</p>
        <StepperRoot value={step} onValueChange={(value) => setStep(String(value))} allowStepClick>
          <StepItem value="datos" title="Datos" description="Captura inicial" />
          <StepItem value="revision" title="Revision" description="Validar datos" />
          <StepItem value="confirmacion" title="Confirmacion" description="Enviar" />
        </StepperRoot>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
        <InputField id="demo-input" label="Texto de ejemplo" value={text} onChange={setText} placeholder="Escribe algo..." />

        <AutoCompleteField<DemoOption>
          id="demo-autocomplete"
          label="Prioridad"
          options={options}
          value={selected}
          onChange={setSelected}
          getOptionValue={(option) => option.code}
          getOptionLabel={(option) => option.label}
          placeholder="Selecciona prioridad"
        />
      </div>

      <EditableTable<DemoRow>
        metadata={{
          module: "examples/components-custom",
          fileName: "logbotones.log",
        }}
        title="EditableTable Demo"
        allowCreate
        createRowDefault={{ nombre: "", activo: true }}
        data={rows}
        columns={tableColumns}
        getRowId={(row) => row.id}
        onCreate={async (newRow) => {
          const nextId = Math.max(0, ...rows.map((item) => item.id)) + 1;
          setRows((prev) => [...prev, { ...newRow, id: nextId }]);
        }}
        onSave={async (rowId, updatedRow) => {
          setRows((prev) => prev.map((row) => (row.id === rowId ? updatedRow : row)));
        }}
        onDelete={async (rowId) => {
          setRows((prev) => prev.filter((row) => row.id !== rowId));
        }}
        onOpen={(rowId) => {
          console.log("Abrir fila", rowId);
        }}
        actions={{
          frontOrder: ["open", "edit"],
          backOrder: ["delete"],
          enabled: {
            open: true,
            edit: true,
            delete: true,
          },
        }}
      />
    </div>
  );
}

