# Uso De `useFetch...` Con TanStack

## Que Resuelve

Consumir catalogos con hooks ya estandarizados por `createCatalogHook` y `createCatalogFetcher`.

## Snippet Basico

```tsx
"use client";

import { useFetchTipoDocumentacion } from "@/fetch/configuracion/catalogos";

export function EjemploCatalogo() {
  const tipoDocFetch = useFetchTipoDocumentacion();

  if (tipoDocFetch.isLoading) return <p>Cargando...</p>;
  if (tipoDocFetch.isError) return <p>Error: {tipoDocFetch.error.message}</p>;

  const items = tipoDocFetch.data?.items ?? [];

  return (
    <ul>
      {items.map((item) => (
        <li key={item.value}>{item.label}</li>
      ))}
    </ul>
  );
}
```

## Snippet Con Filtros

```tsx
const modulosFetch = useFetchModulos(
  { estado: 1, pagina: 1, limite: 25 },
  { enabled: true }
);
```

## Nota

Los hooks usan TanStack Query internamente y ya incluyen:

- `queryKey` consistente
- `staleTime` de 10 minutos
- `meta` para trazabilidad (`feature`, `entity`, `action`)

