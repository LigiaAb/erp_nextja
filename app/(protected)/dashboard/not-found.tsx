import React from "react";
import { ChevronLeft, FileQuestion, Home } from "lucide-react";
import Link from "next/link";
import { PermissionsProvider } from "@/providers/PermissionsProvider";

const NotFound = () => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center space-y-10">
      <FileQuestion className="text-primary animate-pulse" size={80} />

      <div className="flex flex-col space-y-2 animate-in slide-in-from-bottom-5 duration-700 fade-in justify-center items-center">
        <h1 className="text-7xl font-bold text-primary ">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">Página no encontrada</h2>
        <p className="text-muted-foreground text-center">Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido movida o eliminada.</p>
      </div>

      <Link href="/dashboard" className="group inline-flex items-center animate-in slide-in-from-bottom-5 duration-1400 fade-in  overflow-hidden rounded-md cursor-pointer hover:bg-primary/20 pr-2 ">
        <div className="felx rounded-md bg-primary text-primary-foreground py-2 pr-2 shrink-0 inline-flex">
          {/* <ChevronLeft className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" /> */}
          <ChevronLeft />
          <Home />
        </div>

        <div className="grid grid-cols-[0fr] transition-all duration-300 group-hover:grid-cols-[1fr]">
          <span className="overflow-hidden whitespace-nowrap pl-0 opacity-0 transition-all duration-300 group-hover:pl-2 group-hover:opacity-100">Volver al Inicio</span>
        </div>
      </Link>
    </div>
  );
};

export default NotFound;
