"use client";

import { CatalogTipoDocumentacion, useFetchTipoDocumentacion, useInsertarTipoDocumentacion, useActualizarTipoDocumentacion } from "@/fetch/configuracion/catalogos";
import { EditableColumn } from "@/types/components/table";
import { EditableTable } from "@/components/custom/Table";

export const TipoDocumentacionTabla = () => {
  const tipoDocumentacionFetch = useFetchTipoDocumentacion();
  const insertarTipoDocumentacion = useInsertarTipoDocumentacion();
  const actualizarTipoDocumentacion = useActualizarTipoDocumentacion();

  if (tipoDocumentacionFetch.isLoading) return <p>Loading...</p>;
  if (tipoDocumentacionFetch.isError) if (tipoDocumentacionFetch.error.status !== 1001) return <p>Error: {JSON.stringify(tipoDocumentacionFetch.error.status)}</p>;

  const tipoDocumentacion = tipoDocumentacionFetch.data ?? { items: [] };

  const columns: EditableColumn<CatalogTipoDocumentacion>[] = [
    {
      id: "value",
      header: "Código",
      type: "number",
      editable: false,
      required: false,
      align: "left",
      placeholder: "Código",
    },
    {
      id: "label",
      header: "Documentación",
      type: "text",
      editable: true,
      required: true,
      align: "left",
      placeholder: "Documentación",
    },
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
        allowCreate
        onSave={async (rowId, updatedRow) => {
          const id = Number(rowId);

          if (!id || id === 0) {
            await insertarTipoDocumentacion.mutateAsync({
              body: {
                desc_tip_docu: updatedRow.label,
                cod_estado: 1,
              },
            });
          } else {
            await actualizarTipoDocumentacion.mutateAsync({
              body: {
                cod_tip_docu: id,
                desc_tip_docu: updatedRow.label,
                cod_estado: 1,
              },
            });
          }

          await tipoDocumentacionFetch.refetch();
        }}
        onDelete={async (rowId, row) => {
          const id = Number(rowId);

          await actualizarTipoDocumentacion.mutateAsync({
            body: {
              cod_tip_docu: id,
              desc_tip_docu: row.label,
              cod_estado: 4,
            },
          });

          await tipoDocumentacionFetch.refetch();
        }}
      />
    </>
  );
};
