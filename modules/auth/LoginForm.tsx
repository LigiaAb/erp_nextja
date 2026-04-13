"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import InputField from "@/components/custom/form/inputField";
import { Eye, EyeClosed, Lock, LockOpen, Mail } from "lucide-react";
import { InputGroupButton } from "@/components/ui/input-group";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import styles from "./loginForm.module.css";
import { useRouter } from "next/navigation";
import { getUser, loginAction } from "@/lib/auth/actions";
import { useDispatch } from "react-redux";
import { apiFetch } from "@/lib/api/apiFetch";
import { setUserData } from "@/store/auth/authSlice";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Ingrese un correo" })
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Ingrese un correo válido",
    }),
  password: z.string().min(1, { message: "Ingrese su contraseña" }),
});

type FormData = z.infer<typeof schema>;

const LoginForm = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const dispatch = useDispatch();

  // const { login } = useAuthStore();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);

    try {
      if (!data.email || !data.password) throw new Error("Ingresa usuario y contraseña.");

      console.log("Login request [client]:", { usuario: data.email as string, pass: data.password as string });
      const res = await loginAction({
        usuario: data.email as string,
        pass: data.password as string,
      });

      if (!res.ok) throw new Error(res.message);

      const token = res.token ?? "";
      const version_app = res.version_app ?? "";
      const cod_usuario = res.cod_usuario ?? "";

      if (cod_usuario) localStorage.setItem("cod_usuario", cod_usuario);
      if (token) localStorage.setItem("token", token);
      if (version_app) localStorage.setItem("version_app", version_app);

      // obtener ultima ruta desde session storage
      const lastRoute = sessionStorage.getItem("lastRoute");
      //  obtener context defualt desde local storage
      const ctxDefault = localStorage.getItem("ctx_default");
      if (lastRoute && ctxDefault) {
        router.replace(lastRoute);
      } else {
        router.replace("/context");
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-full" id="test">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <InputField
                id="email"
                label="Correo"
                value={email ?? ""}
                onChange={(val) => setValue("email", val, { shouldValidate: true, shouldDirty: true })}
                errors={errors.email ? [{ message: errors.email.message! }] : []}
                type="email"
                addonProps={{ children: <Mail /> }}
                // endAddonProps={{ children: <span className="text-xs opacity-60">Ctrl+K</span> }}
                clearButtonProps={{ className: "hover:bg-red-500/10" }}
                autoFocus
              />
              <InputField
                id="password"
                label="Contraseña"
                value={password ?? ""}
                onChange={(val) => setValue("password", val, { shouldValidate: true, shouldDirty: true })}
                errors={errors.password ? [{ message: errors.password.message! }] : []}
                type={passwordVisible ? "text" : "password"}
                addonProps={{ children: <>{passwordVisible ? <LockOpen /> : <Lock />}</> }}
                endAddonProps={{
                  children: (
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                      // ✅ evita blur / efectos raros
                      onMouseDown={(e) => e.preventDefault()}
                      className="hover:bg-accent/20"
                      onClick={(e) => {
                        e.preventDefault();
                        setPasswordVisible(!passwordVisible);
                      }}
                    >
                      {passwordVisible ? <EyeClosed className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </InputGroupButton>
                  ),
                }}
                clearButtonProps={{ className: "hover:text-red-500/50" }}
              />
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal" className="flex-col">
            <Button type="submit" className={`${styles.iniciarSesion}`} variant="outline" disabled={loading}>
              {loading ? "...Iniciando sesión" : "Iniciar sesión"}
            </Button>
            <Button type="button" className={`${styles.reiniciarContrasena}`} variant="ghost">
              Reiniciar contraseña
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default LoginForm;
