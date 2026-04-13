"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logButtonClick } from "@/lib/logs/logButtonClick";
import { logGeneralEvent } from "@/lib/logs/logGeneralEvent";
import { buildLoggedLinkHref } from "@/lib/logs/serverLinkLogger";

export function LoggingDemos() {
  const [lastAction, setLastAction] = React.useState("Sin acciones");

  const linkHref = buildLoggedLinkHref({
    to: "/demos", // requerido
    buttonId: "demo-link-dashboard", // requerido
    module: "examples/logging", // requerido
    label: "Demo link server-side", // opcional
    fileName: "logbotones.log", // opcional
  });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Ultima accion: <span className="font-medium text-foreground">{lastAction}</span>
      </p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => {
            void logButtonClick({
              buttonId: "demo-boton-cliente", // requerido
              label: "Demo boton cliente", // opcional
              module: "examples/logging", // requerido
              route: "/dashboard/ejemplos/demos", // opcional
              fileName: "logbotones.log", // opcional
              extra: { source: "LoggingDemos" }, // opcional
            });
            setLastAction("Boton cliente logueado");
          }}
        >
          Log Boton Cliente
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await logButtonClick({
              buttonId: "demo-boton-await", // requerido
              label: "Demo boton await", // opcional
              module: "examples/logging", // requerido
              fileName: "logbotones.log", // opcional
            });
            setLastAction("Boton await logueado");
          }}
        >
          Log Boton Await
        </Button>

        <Button asChild type="button" variant="secondary">
          <Link href={linkHref}>Link Con Log Server-Side</Link>
        </Button>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void logGeneralEvent({
              eventName: "form_submit", // requerido
              module: "examples/logging", // requerido
              kind: "submit", // opcional
              label: "Formulario demo submit", // opcional
              route: "/dashboard/ejemplos/demos", // opcional
              fileName: "logeventos.log", // opcional
              extra: { source: "LoggingDemosForm" }, // opcional
            });
            setLastAction("Submit logueado (evento general)");
          }}
        >
          <Button type="submit" variant="outline">
            Log Submit (Evento General)
          </Button>
        </form>
      </div>
    </div>
  );
}
