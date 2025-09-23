import { z } from 'zod';

// Schema para o formulário (aceita string para status)
export const estacaoFormSchema = z.object({
  uuid: z.string().min(1, 'UUID é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  status: z
    .string()
    .refine((val) => val === "true" || val === "false", {
      message: "Status é obrigatório"
    }),
  // lat: z.string().nullable().optional(), exemplo de como ficaria se for opcional
  lat: z.string().min(1, 'Latitude é obrigatória'),
  long: z.string().min(1, 'Longitude é obrigatória'),
  endereco: z.string().min(1, 'Endereço é obrigatório'),
  imagemUrl: z.string().nullable().optional(),
  parametros: z.array(z.string()).min(1, "Selecione pelo menos um parâmetro"),
});

// Schema para validação final (converte status para boolean)
export const estacaoValidationSchema = estacaoFormSchema.transform((data) => ({
  ...data,
  status: data.status === "true"
}));

export type EstacaoFormSchema = z.infer<typeof estacaoFormSchema>;
export type EstacaoValidationSchema = z.infer<typeof estacaoValidationSchema>;
