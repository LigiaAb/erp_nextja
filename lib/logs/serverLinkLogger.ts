import { resolveClientCodUsuario } from "@/lib/logs/codUsuario";

type BuildLoggedLinkHrefParams = {
  to: string;
  buttonId: string;
  module: string;
  label?: string;
  fileName?: string;
  cod_usuario?: string;
};

export function buildLoggedLinkHref(params: BuildLoggedLinkHrefParams) {
  const cod_usuario = resolveClientCodUsuario(params.cod_usuario);

  const searchParams = new URLSearchParams({
    to: params.to,
    buttonId: params.buttonId,
    module: params.module,
  });

  if (params.label) searchParams.set("label", params.label);
  if (params.fileName) searchParams.set("fileName", params.fileName);
  if (cod_usuario) {
    searchParams.set("cod_usuario", cod_usuario);
  }

  return `/api/logs/link?${searchParams.toString()}`;
}
