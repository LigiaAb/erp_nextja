import ChangeTheme from "@/components/custom/ChangeTheme";
import Logo from "@/components/custom/Logo";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Auth",
  description: "Auth",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[url('@/assets/FONDO1.jpg')] bg-cover bg-center bg-no-repeat" />
      <div className="bg-background/10 absolute inset-0 -z-10" />
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg">
        <CardContent className="relative flex items-center justify-center py-6 sm:py-8">
          <div className="absolute top-0 right-0 px-2">
            <ChangeTheme />
          </div>

          {/* Opción 1: responsive con Tailwind (recomendada) */}
          <Logo className="text-primary-icon " size={"xl"} />

          {/* Opción 2: si quieres seguir con size, usa clamp (ver abajo) */}
        </CardContent>

        <CardContent className="flex items-center justify-center px-4 sm:px-6 pb-6">{children}</CardContent>
      </Card>
    </main>
  );
}
