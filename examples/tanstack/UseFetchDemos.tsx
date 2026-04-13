"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useFetchCategorias, useFetchMenus, useFetchModulos } from "@/fetch/configuracion/accesos";
import { useFetchTipoDocumentacion } from "@/fetch/configuracion/catalogos";
import { createCatalogMutationFetcher, createCatalogMutationHook } from "@/fetch/fetchFactory";

type DemoMutationBody = {
  nombre: string;
  activo: boolean;
};

type DemoMutationResponse = {
  ok: boolean;
  receivedAt: string;
  payload: DemoMutationBody | null;
};

const mutateDemoEcho = createCatalogMutationFetcher<DemoMutationBody, DemoMutationResponse>("/api/demos/echo", "POST");
const useDemoEchoMutation = createCatalogMutationHook<DemoMutationBody, DemoMutationResponse>("demo_echo", mutateDemoEcho);

export function UseFetchDemos() {
  const [mutationResult, setMutationResult] = React.useState<DemoMutationResponse | null>(null);

  const tipoDoc = useFetchTipoDocumentacion(undefined, {
    meta: {
      source: "UseFetchDemos",
      example: "createCatalogHook-options",
    },
  });
  const modulos = useFetchModulos();
  const menus = useFetchMenus();
  const categorias = useFetchCategorias();

  const echoMutation = useDemoEchoMutation({
    onSuccess: (data) => {
      setMutationResult(data);
    },
  });

  const isLoading = tipoDoc.isLoading || modulos.isLoading || menus.isLoading || categorias.isLoading;
  const firstError = tipoDoc.error ?? modulos.error ?? menus.error ?? categorias.error;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => void tipoDoc.refetch()}>
          Refetch Tipo Documentacion
        </Button>
        <Button type="button" variant="outline" onClick={() => void modulos.refetch()}>
          Refetch Modulos
        </Button>
        <Button type="button" variant="outline" onClick={() => void menus.refetch()}>
          Refetch Menus
        </Button>
        <Button type="button" variant="outline" onClick={() => void categorias.refetch()}>
          Refetch Categorias
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            echoMutation.mutate({
              body: {
                nombre: "registro demo",
                activo: true,
              },
            })
          }
          disabled={echoMutation.isPending}
        >
          {echoMutation.isPending ? "Mutando..." : "Mutation Demo"}
        </Button>
      </div>

      {isLoading ? <p className="text-sm text-muted-foreground">Cargando hooks useFetch...</p> : null}

      {firstError ? <p className="text-sm text-destructive">Error: {firstError.message}</p> : null}
      {echoMutation.error ? <p className="text-sm text-destructive">Mutation error: {echoMutation.error.message}</p> : null}
      {mutationResult ? <p className="text-sm text-muted-foreground">Mutation ok: {mutationResult.receivedAt}</p> : null}

      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-md border p-3">
          <p className="font-medium">tipo_documentacion</p>
          <p className="text-muted-foreground">Is {tipoDoc.isRefetching ? "" : "Not"} Refetching</p>
          <p className="text-muted-foreground">Is {tipoDoc.isLoading ? "" : "Not"} Loading</p>
          <p className="text-muted-foreground">items: {tipoDoc.data?.items.length ?? 0}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="font-medium">modulos</p>
          <p className="text-muted-foreground">Is {modulos.isRefetching ? "" : "Not"} Refetching</p>
          <p className="text-muted-foreground">Is {modulos.isLoading ? "" : "Not"} Loading</p>
          <p className="text-muted-foreground">items: {modulos.data?.items.length ?? 0}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="font-medium">menus</p>
          <p className="text-muted-foreground">Is {menus.isRefetching ? "" : "Not"} Refetching</p>
          <p className="text-muted-foreground">Is {menus.isLoading ? "" : "Not"} Loading</p>
          <p className="text-muted-foreground">items: {menus.data?.items.length ?? 0}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="font-medium">categorias</p>
          <p className="text-muted-foreground">Is {categorias.isRefetching ? "" : "Not"} Refetching</p>
          <p className="text-muted-foreground">Is {categorias.isLoading ? "" : "Not"} Loading</p>
          <p className="text-muted-foreground">items: {categorias.data?.items.length ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
