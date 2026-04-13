"use client";

import { CatalogoErrores, useFetchCatalogoErrores } from "@/fetch/configuracion/catalogos";
import { EditableColumn } from "@/types/components/table";
import { EditableTable } from "@/components/custom/Table";

export const CatalogoErroresTabla = () => {
  const tipoDocumentacionFetch = useFetchCatalogoErrores();

  if (tipoDocumentacionFetch.isLoading) return <p>Loading...</p>;
  if (tipoDocumentacionFetch.isError) if (tipoDocumentacionFetch.error.status !== 1001) return <p>Error: {JSON.stringify(tipoDocumentacionFetch.error.status)}</p>;

  const tipoDocumentacion = tipoDocumentacionFetch.data ?? { items: [] };

  const columns: EditableColumn<CatalogoErrores>[] = [
    { id: "value", header: "Código", type: "number", align: "left", placeholder: "Código" },
    { id: "label", header: "Descripcion", type: "text", align: "left", placeholder: "Descripcion" },
  ];

  return (
    <>
      <EditableTable
        metadata={{
          module: "configuracion/catalogos/tipo-documentacion",
          fileName: "logbotones.log",
        }}
        title="Catalogo de Tipos de Documentación"
        getRowId={(row) => row.value}
        columns={columns}
        data={tipoDocumentacion.items}
        actions={{
          showFrontColumn: false,
          showBackColumn: false,
        }}
      />
    </>
  );
};
