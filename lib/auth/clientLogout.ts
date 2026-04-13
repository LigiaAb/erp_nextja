"use client";

import { logoutAction } from "@/lib/auth/actions";
import { resetAppState, type AppDispatch } from "@/store";

type RouterLike = {
  replace: (href: string) => void;
};

const SESSION_STORAGE_KEYS = ["currentModulo", "currentModuloName", "currentMenu", "currentCategoria", "ctx"] as const;
const LOCAL_STORAGE_KEYS = ["cod_usuario", "token", "version_app", "auth"] as const;
const COOKIE_KEYS = ["session_expired", "token", "version", "version_app", "ctx"] as const;

function deleteClientCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export async function runClientLogoutFlow(args: {
  dispatch: AppDispatch;
  router: RouterLike;
  redirectTo?: string;
  pathname?: string;
}) {
  const { dispatch, router, redirectTo = "/", pathname } = args;

  try {
    await logoutAction();
  } catch {
    // Aunque falle el logout backend, igual limpiamos cliente.
  }

  if (pathname) {
    sessionStorage.setItem("lastRoute", pathname);
  }

  for (const key of LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }

  for (const key of SESSION_STORAGE_KEYS) {
    sessionStorage.removeItem(key);
  }

  for (const key of COOKIE_KEYS) {
    deleteClientCookie(key);
  }

  dispatch(resetAppState());
  router.replace(redirectTo);
}

