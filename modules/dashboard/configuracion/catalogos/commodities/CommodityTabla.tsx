"use client";

import { CatalogoComodity, useFetchCommodities, useInsertarCommodities, useActualizarCommodities } from "@/fetch/configuracion/catalogos";
import { EditableColumn } from "@/types/components/table";
import { EditableTable } from "@/components/custom/Table";

export const CommodityTabla = () => {
  const commodityFetch = useFetchCommodities({ cod_estado: 1 }); // Se filtra solo los activos
  const insertarCommodity = useInsertarCommodities();
  const actualizarCommodity = useActualizarCommodities();

  if (commodityFetch.isLoading) return <p>Loading...</p>;
  if (commodityFetch.isError) if (commodityFetch.error.status !== 1001) return <p>Error: {JSON.stringify(commodityFetch.error.status)}</p>;

  const commodity = commodityFetch.data ?? { items: [] };

  const columns: EditableColumn<CatalogoComodity>[] = [
    { id: "value", header: "Código", type: "number", editable: false, required: false, align: "left", placeholder: "Código" },
    { id: "nombre", header: "Commodity", type: "text", editable: true, required: true, align: "left", placeholder: "Commodity" },
    { id: "descripcion", header: "Descripción", type: "text", editable: true, required: true, align: "left", placeholder: "Descripción" },
  ];

  return (
    <>
      <EditableTable
        metadata={{
          module: "configuracion/catalogos/Commodity",
          fileName: "logbotones.log",
        }}
        title="Catalogo de Commodities"
        getRowId={(row) => row.value}
        columns={columns}
        data={commodity.items}
        allowCreate
        onCreate={async (newRow) => {
          await insertarCommodity.mutateAsync({
            body: { ...newRow, cod_estado: 1 },
          });

          await commodityFetch.refetch();
        }}
        onSave={async (rowId, updatedRow) => {
          await actualizarCommodity.mutateAsync({
            body: { cod_commodity: Number(rowId), nombre: updatedRow.nombre, descripcion: updatedRow.descripcion, cod_estado: 1 },
          });

          await commodityFetch.refetch();
        }}
        onDelete={async (rowId, row) => {
          await actualizarCommodity.mutateAsync({
            body: { cod_commodity: Number(rowId), nombre: row.nombre, descripcion: row.descripcion, cod_estado: 4 },
          });

          await commodityFetch.refetch();
        }}
      />
    </>
  );
};
