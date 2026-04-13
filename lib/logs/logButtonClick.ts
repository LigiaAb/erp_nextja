import { resolveClientCodUsuario } from "@/lib/logs/codUsuario";

export type LogButtonClickParams = {
  buttonId: string;
  label?: string;
  module: string;
  route?: string;
  cod_usuario?: string;
  fileName?: string;
  extra?: Record<string, unknown>;
};

export const logButtonClick = async (params: LogButtonClickParams) => {
  const cod_usuario = resolveClientCodUsuario(params.cod_usuario);

  try {
    await fetch("/api/logs/button", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: params.fileName,
        entry: {
          buttonId: params.buttonId,
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
