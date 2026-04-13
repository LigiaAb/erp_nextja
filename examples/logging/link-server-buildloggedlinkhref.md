# Log Server-Side En Link (`buildLoggedLinkHref`)

## Que Resuelve

Registrar click de un `Link` sin usar `onClick` cliente. El flujo es:

1. El `Link` apunta a `/api/logs/link?...`
2. El endpoint registra el evento
3. El endpoint redirige a la ruta final

## Snippet En Componente Server

```tsx
import Link from "next/link";
import { buildLoggedLinkHref } from "@/lib/logs/serverLinkLogger";

export function NavbarLogoLink() {
  const href = buildLoggedLinkHref({
    to: "/demos", // requerido
    buttonId: "navbar-logo-dashboard", // requerido
    module: "dashboard/ui/navbar", // requerido
    label: "Logo Dashboard", // opcional
    fileName: "logbotones.log", // opcional
    cod_usuario: "123", // opcional (si no va, se intenta resolver automatico en cliente)
  });

  return <Link href={href}>Dashboard</Link>;
}
```

## Cuando Usarlo

- Componentes server donde no quieres convertir todo a `"use client"`.
- Links que deben loguearse siempre antes de navegar.
