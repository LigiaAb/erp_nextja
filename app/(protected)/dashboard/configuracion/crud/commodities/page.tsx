import { CommodityTabla } from "@/modules/dashboard/configuracion/catalogos/commodities/CommodityTabla";
import React from "react";

export const metadata = {
  title: "CRUD - Tipos de Documentación",
};

const page = () => {
  return <CommodityTabla />;
};

export default page;
