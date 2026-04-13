import { TipoDocumentacionTabla } from "@/modules/dashboard/configuracion/catalogos/tipo-documentacion/TipoDocumentacionTabla";
import React from "react";

export const metadata = {
  title: "CRUD - Tipos de Documentación",
};

const page = () => {
  return <TipoDocumentacionTabla />;
};

export default page;
