# Log De Boton En Cliente (`logButtonClick`)

## Que Resuelve

Registrar clicks de botones desde componentes cliente y escribir en `logs/*.log` via `/api/logs/button`.

## Snippet

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { logButtonClick } from "@/lib/logs/logButtonClick";

export function BotonConLog() {
  return (
    <Button
      onClick={() => {
        void logButtonClick({
          buttonId: "perfil-guardar", // requerido
          label: "Guardar perfil", // opcional
          module: "dashboard/perfil", // requerido
          fileName: "logbotones.log", // opcional
          route: "/dashboard/perfil", // opcional
          cod_usuario: "123", // opcional (si no va, se intenta resolver automatico)
          extra: { source: "toolbar" }, // opcional
        });

        // logica normal
      }}
    >
      Guardar
    </Button>
  );
}
```

## Variante Async

```tsx
onClick={async () => {
  await logButtonClick({
    buttonId: "perfil-guardar", // requerido
    module: "dashboard/perfil", // requerido
  });
  await saveProfile();
}}
```
