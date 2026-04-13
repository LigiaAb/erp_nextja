import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ✅ Mock next/navigation
const router = {
  push: vi.fn(),
  replace: vi.fn(),
};
vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

// ✅ Mock loginAction
const loginActionMock = vi.fn<(data: LoginBody) => Promise<LoginResult>>();

vi.mock("@/lib/auth/actions", () => ({
  loginAction: (data: LoginBody) => loginActionMock(data),
}));

import LoginForm from "@/modules/auth/LoginForm";
import { LoginBody, LoginResult } from "@/types/auth/login";

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("muestra validaciones: correo requerido", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText("Ingrese un correo")).toBeInTheDocument();
    // también cae password requerido (tu schema lo valida), pero no es necesario asertarlo aquí
    expect(loginActionMock).not.toHaveBeenCalled();
  });

  it("muestra validación: correo inválido", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Correo"), "abc");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText("Ingrese un correo válido")).toBeInTheDocument();
    expect(loginActionMock).not.toHaveBeenCalled();
  });

  it("muestra validación: contraseña requerida", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText("Correo"), "test@mail.com");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText("Ingrese su contraseña")).toBeInTheDocument();
    expect(loginActionMock).not.toHaveBeenCalled();
  });

  it("toggle de password cambia el type", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const password = screen.getByLabelText("Contraseña") as HTMLInputElement;
    expect(password.type).toBe("password");

    const toggleBtn = screen.getByRole("button", { name: /mostrar contraseña/i });

    await user.click(toggleBtn);
    expect(password.type).toBe("text");

    await user.click(toggleBtn);
    expect(password.type).toBe("password");
  });

  it("login OK: llama loginAction, guarda cod_usuario y hace replace('/context')", async () => {
    const user = userEvent.setup();

    loginActionMock.mockResolvedValueOnce({
      ok: true,
      message: "ok",
      cod_usuario: "123",
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Correo"), "test@mail.com");
    await user.type(screen.getByLabelText("Contraseña"), "1234");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(loginActionMock).toHaveBeenCalledWith({ usuario: "test@mail.com", pass: "1234" });
    expect(localStorage.getItem("cod_usuario")).toBe("123");
    expect(router.replace).toHaveBeenCalledWith("/context");
  });
});
