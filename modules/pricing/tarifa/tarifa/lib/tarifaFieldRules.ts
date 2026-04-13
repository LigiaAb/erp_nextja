export const fieldRules = {
  empresa: {
    cod: "cod_empresa",
    catalogo: "empresas",
    payload: ["servicio"],
    readonly: true,
  },
  tipoTransporte: {
    cod: "cod_tipo_transporte",
    reset: ["tipoServicio"],
    payload: ["servicio"],
  },
};
