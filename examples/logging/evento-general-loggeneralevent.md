# Log De Evento General (`logGeneralEvent`)

## Que Resuelve

Registrar eventos que no son directamente `onClick`, por ejemplo `submit`, `change`, `blur`, procesos automáticos o eventos de negocio.

## Snippet (`onSubmit`)

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { logGeneralEvent } from "@/lib/logs/logGeneralEvent";

export function FormConLogGeneral() {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void logGeneralEvent({
          eventName: "form_submit", // requerido
          module: "dashboard/perfil", // requerido
          kind: "submit", // opcional
          label: "Formulario perfil", // opcional
          route: "/dashboard/perfil", // opcional
          fileName: "logeventos.log", // opcional
          cod_usuario: "123", // opcional (si no va, se intenta resolver automatico)
          extra: { source: "perfilForm" }, // opcional
        });
      }}
    >
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

