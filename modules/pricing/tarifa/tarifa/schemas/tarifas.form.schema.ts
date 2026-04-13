import { z } from "zod";

export const formSchema = z.object({
  empresa: z
    .object({
      label: z.string(),
      value: z.number(),
    })
    .nullable(),

  nombre: z.string().min(1, "Requerido"),

  fechaInicio: z.date().nullable(),
});
