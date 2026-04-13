// app/api/permisos/route.ts
import { NextResponse } from "next/server";
import { apiFetch, buildUrl, type ApiError } from "@/lib/api/apiFetch";

type PermisosUsuarios = unknown; // <- si quieres, importa tu tipo real
// import type { PermisosUsuarios } from "@/types/auth/user";

type BackendEnvelope = {
  success: boolean;
  cod_mensaje: number;
  mensaje?: string;
  data?: {
    json?: PermisosUsuarios;
  };
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cod_usuario = searchParams.get("cod_usuario");

  if (!cod_usuario) {
    return NextResponse.json({ message: "Falta cod_usuario" }, { status: 400 });
  }

  try {
    const url = buildUrl("/api/appweb/get-json-usuario", { cod_usuario });

    const res = await apiFetch<BackendEnvelope>(url, {
      method: "GET",
      auth: true,
      expectEnvelope: true,
    });

    const json = res?.data?.json;

    if (!json) {
      return NextResponse.json({ message: "Respuesta inválida (json faltante)" }, { status: 502 });
    }

    return NextResponse.json({ json });
  } catch (e) {
    const err = e as ApiError;
    return NextResponse.json({ message: err.message ?? "Error cargando permisos", cod_mensaje: err.cod_mensaje }, { status: err.status ?? 500 });
  }
}
