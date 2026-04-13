import { resolveClientCodUsuario } from "@/lib/logs/codUsuario";

export type LogGeneralEventParams = {
  eventName: string;
  module: string;
  kind?: string;
  label?: string;
  route?: string;
  cod_usuario?: string;
  fileName?: string;
  extra?: Record<string, unknown>;
};

export const logGeneralEvent = async (params: LogGeneralEventParams) => {
  const cod_usuario = resolveClientCodUsuario(params.cod_usuario);

  try {
    await fetch("/api/logs/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: params.fileName ?? "logeventos.log",
        entry: {
          eventName: params.eventName,
          kind: params.kind ?? "general",
          label: params.label,
          module: params.module,
          route: params.route,
          cod_usuario,
          extra: params.extra,
        },
      }),
      keepalive: true,
    });
  } catch {
    // No bloqueamos la UX si falla el log.
  }
};

