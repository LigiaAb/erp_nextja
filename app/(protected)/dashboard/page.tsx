import React from "react";
import Modulos from "@/modules/dashboard/ui/modulos";
import { GraficaVentas } from "@/modules/dashboard/dashboard/exportaciones";

const Page = () => {
  return (
    <main className="max-w-full min-w-full scroll">
      {/* <pre className="max-h-[20px]">{JSON.stringify(permisos, null, 2)}</pre> */}
      <GraficaVentas />
    </main>
  );
};

export default Page;
