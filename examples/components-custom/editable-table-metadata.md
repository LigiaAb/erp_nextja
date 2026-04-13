# `EditableTable` Con `metadata`

## Que Resuelve

Centralizar logging de acciones de la tabla desde `components/custom/Table.tsx` sin repetirlo en cada caller.

## Snippet Basico

```tsx
"use client";

import { EditableTable } from "@/components/custom/Table";
import type { EditableColumn } from "@/types/components/table";

type Item = { id: number; nombre: string };

const columns: EditableColumn<Item>[] = [
  { id: "nombre", header: "Nombre", type: "text", editable: true, required: true },
];

export function TablaEjemplo({ data }: { data: Item[] }) {
  return (
    <EditableTable<Item>
      metadata={{
        module: "dashboard/ejemplos/tabla",
        fileName: "logbotones.log",
      }}
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      onSave={async (rowId, updatedRow) => {
        console.log("Guardar", rowId, updatedRow);
      }}
      onDelete={async (rowId) => {
        console.log("Eliminar", rowId);
      }}
    />
  );
}
```

## Botones Que Ya Se Loguean En Interno

- `open`, `edit`, `delete`, `copy`, `download`, `mail`, `auth`, `pdf`, `print`, `kanban`
- `Guardar`, `Cancelar`, `Crear`, `Limpiar`

