export function formToPayload(values) {
  return {
    cod_empresa: values.empresa?.value,
    cod_cc: values.centroCosto?.value,
  };
}
export function apiToForm(item, catalogos) {
  return {
    empresa: catalogos.empresas.find((e) => e.value === item.cod_empresa),
  };
}
