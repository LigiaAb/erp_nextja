# Ejemplos Del Proyecto

Esta carpeta sirve como registro de ejemplos de uso reales del proyecto.

## Estructura

- `registro.json`: indice de ejemplos con categoria y ruta.
- `logging/`: ejemplos de `logButtonClick` y `buildLoggedLinkHref`.
- `tanstack/`: ejemplos de hooks `useFetch...` basados en TanStack Query.
- `components-custom/`: ejemplos de componentes dentro de `components/custom`.

## Como Registrar Un Nuevo Ejemplo

1. Crear un archivo `.md` en la categoria correspondiente.
2. Agregar el snippet minimo reproducible.
3. Registrar la entrada en `registro.json`.
4. Si aplica, enlazar archivo real del proyecto donde ya se use ese patron.

## Convenciones

- Nombre de archivo: `tema-caso.md` (ejemplo: `tabla-editable-metadata.md`)
- Mantener snippets cortos y listos para copiar.
- Incluir siempre:
  - Que resuelve
  - Snippet
  - Variantes comunes

