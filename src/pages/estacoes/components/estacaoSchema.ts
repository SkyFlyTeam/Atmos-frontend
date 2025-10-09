import { z } from 'zod';

export const estacaoFormSchema = z.object({
  uuid: z.string().min(1, 'UUID é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  status: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Status é obrigatório"
    }),

  // Campos de localização - apenas um conjunto pode ser preenchido por vez
  // 1. Coordenadas
  lat: z.string().optional(),
  long: z.string().optional(),
  
  // 2. Endereço
  endereco: z.string().optional(),
  cidadeIbgeId: z.string().nullable().optional(),
  cidadeNome: z.string().nullable().optional(),
  cidadeUf: z.string().nullable().optional(),

  imagemUrl: z.string().nullable().optional(),
  parametros: z.array(z.string()).min(1, "Selecione pelo menos um parâmetro"),
}).superRefine((data, ctx) => {
  const temLatLong = !!data.lat && !!data.long;
  const temEndereco = !!data.endereco;
  const temCidade = !!data.cidadeIbgeId && !!data.cidadeNome && !!data.cidadeUf;
  
  // Verifica se pelo menos um dos métodos de localização está preenchido
  if (!temLatLong && !(temEndereco && temCidade)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "É obrigatório preencher: (Latitude e Longitude) OU (Cidade e Endereço)",
      path: ["lat"],
    });
    return;
  }
  
  // Se ambos os métodos estiverem preenchidos, gera erro
  if (temLatLong && (temEndereco || temCidade)) {
    if (temEndereco) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Remova o endereço ou as coordenadas para continuar",
        path: ["endereco"],
      });
    }
    if (temCidade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Remova a cidade ou as coordenadas para continuar",
        path: ["cidadeNome"],
      });
    }
  }
});

export const estacaoValidationSchema = estacaoFormSchema.transform((data) => ({
  ...data,
  status: data.status === "true",
}));

export type EstacaoFormSchema = z.infer<typeof estacaoFormSchema>;
export type EstacaoValidationSchema = z.infer<typeof estacaoValidationSchema>;
