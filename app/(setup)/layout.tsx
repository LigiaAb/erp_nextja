import { Card, CardContent } from "@/components/ui/card";
import ContextGate from "@/providers/contextProvider";
import { PermissionsProvider } from "@/providers/PermissionsProvider";

export default function SetupLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContextGate requireCtx={false}>
      <PermissionsProvider>
        <main className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[url('@/assets/FONDO2.jpg')] bg-cover bg-center bg-no-repeat" />
          <div className="bg-background/10 absolute inset-0 -z-10" />
          <Card className="relative flex items-center justify-center py-6 sm:py-8 w-full max-w-[50vw] bg-background/50 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center px-4 sm:px-6 pb-6 max-w-[50vw]">{children}</CardContent>
          </Card>
        </main>
      </PermissionsProvider>
    </ContextGate>
  );
}
