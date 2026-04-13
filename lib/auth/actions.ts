// app/auth/actions.ts
"use server";

import { cookies } from "next/headers";
import { apiFetch, buildUrl } from "../api/apiFetch";
import { LoginApiError, LoginBody, LoginResponse, LoginResult } from "@/types/auth/login";

type BackendEnvelope = {
  success: boolean;
  cod_mensaje: number;
  mensaje?: string;
  data?: unknown;
};

export async function loginAction(data: LoginBody): Promise<LoginResult> {
  const encoded = btoa(unescape(encodeURIComponent(data.pass)));
  const user = { usuario: data.usuario, pass: encoded };
  const response = await apiFetch<LoginResponse, LoginBody, LoginApiError>("/public/api/ingresar", {
    method: "POST",
    body: user,
  });

  if (!response.data?.success) return { ok: false, message: response.data?.mensaje ?? "Error inesperado." };

  const token = response.data?.token_usuario ?? "";
  const version_app = response.data?.version_app ?? "";
  const cod_usuario = response.data?.cod_usuario ?? "";

  if (!token) return { ok: false, message: "Login inválido: el backend no devolvió token." };

  if (!version_app) return { ok: false, message: "Login inválido: el backend no devolvió app_version." };

  const cookieStore = await cookies();

  const cookieBase = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };

  cookieStore.set("token", token, cookieBase);
  cookieStore.set("version_app", version_app, cookieBase);

  return { ok: true, cod_usuario, token, version_app };
}

export async function getUser(cod_usuario: number) {
  console.log("Cod_usuario: ", cod_usuario);

  const url = buildUrl("/api/appweb/get-json-usuario", { cod_usuario });

  const res = await apiFetch<BackendEnvelope>(url, {
    method: "GET",
    auth: true,
    expectEnvelope: true,
  });

  const json = res?.data;

  console.log(json);

  return { ok: true, user: json };
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("token");
  cookieStore.delete("version");
  cookieStore.delete("version_app");
  cookieStore.delete("ctx");

  return { ok: true };
}
