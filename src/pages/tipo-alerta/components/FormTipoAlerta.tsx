import { TipoAlerta, criteriosEnum } from "@/interfaces/TipoAlerta";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import { tipoAlertaServices } from "@/services/tipoAlertaService";
import { toast } from "react-toastify";

type FormTipoAlertaProps = {
  paramData?: TipoAlerta;
  onClose: (success: boolean) => void;
<<<<<<< HEAD
<<<<<<< HEAD
  onDelete?: () => void;
=======
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
=======
  onDelete?: () => void;
>>>>>>> 69656fd (AT-25 fix: aplicar responsividade no formulário)
};

type FormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  pk: z.coerce.number().int("PK deve ser um número inteiro").positive("PK não pode ser negativo").optional(),
  tipo: z.string("Nome é obrigatório").min(1, "Nome deve conter pelo menos 1 caractere"),
  descricao: z.string("Descrição é obrigatória").min(1, "Descrição deve conter pelo menos 1 caractere"), 
<<<<<<< HEAD
  criterios: z.string().min(1, "Critérios é obrigatório").refine((val) => val !== "", {
    message: "Selecione um critério válido"
  }),
  valor_referencia: z.coerce.number("Valor de referência é obrigatório").min(0, "Valor de referência não pode ser negativo"),
  segunda_referencia: z.coerce.number().min(0, "Segunda referência não pode ser negativo").optional(),
  publica: z.boolean().optional()
}).refine((data) => {
  // Se critério for "Intervalo entre" (valor 1), segunda_referencia é obrigatória
  if (data.criterios === "1") {
    return data.segunda_referencia !== null && data.segunda_referencia !== undefined;
  }
  return true;
}, {
  message: "Segunda referência é obrigatória para critério 'Intervalo entre'",
  path: ["segunda_referencia"]
}).refine((data) => {
  // Se critério for "Intervalo entre", p2 deve ser maior ou igual a p1
  if (data.criterios === "1" && data.segunda_referencia !== null && data.segunda_referencia !== undefined) {
    return data.valor_referencia <= data.segunda_referencia;
  }
  return true;
}, {
  message: "2ª referência deve ser maior que valor de referência",
  path: ["segunda_referencia"]
})

const FormTipoAlerta = ({ paramData, onClose, onDelete }: FormTipoAlertaProps) => {
=======
  criterios: z.coerce.number().int("Critérios é obrigatório").min(0).max(4),
  valor_referencia: z.coerce.number("Valor de referência é obrigatório").min(0, "Valor de referência não pode ser negativo"),
  segunda_referencia: z.coerce.number().min(0, "Segunda referência não pode ser negativo").optional(),
  publica: z.boolean().optional()
})

<<<<<<< HEAD
const FormTipoAlerta = ({ paramData, onClose }: FormTipoAlertaProps) => {
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
=======
const FormTipoAlerta = ({ paramData, onClose, onDelete }: FormTipoAlertaProps) => {
>>>>>>> 69656fd (AT-25 fix: aplicar responsividade no formulário)
  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitSuccessful } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: paramData ? {
      ...paramData,
      valor_referencia: paramData.p1 ? Number(paramData.p1) : 0, 
      segunda_referencia: paramData.p2 ? Number(paramData.p2) : null, 
      criterios: paramData.tipo_alarme !== undefined ? String(paramData.tipo_alarme) : ""
<<<<<<< HEAD
    } : {
      criterios: "",
      valor_referencia: 0,
      segunda_referencia: null
    }, 
=======
    } : {}, 
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
  });

  const selectedCriteria = watch("criterios");

  const onSubmit = async (values: any) => {
    const processedData = {
      ...values,
      tipo_alarme: Number(values.criterios),
      p1: Number(values.valor_referencia), 
<<<<<<< HEAD
      p2: values.criterios === "1" ? Number(values.segunda_referencia) : null, 
      publica: values.publica ?? false,
=======
      p2: values.criterios === 1 ? Number(values.segunda_referencia) : null, 
      publica: values.publica ?? false,
      valor_referencia: undefined,
      segunda_referencia: undefined
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
    };

    if(paramData){
        try {
            const response = await tipoAlertaServices.updateTipoAlerta(processedData as TipoAlerta)
            toast.success("Tipo de alerta atualizado com sucesso!")
            onClose(true);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            toast.error("Erro ao tentar atualizar tipo de alerta.");
        }
    }else{
        try {
            const response = await tipoAlertaServices.createTipoAlerta(processedData as TipoAlerta)
            toast.success("Tipo de alerta cadastrado com sucesso!")
            onClose(true);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            toast.error("Erro ao tentar cadastrar tipo de alerta.");
        }
    }
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end w-full">
      <div className="w-full space-y-4">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
           <div className="relative">
             <label htmlFor="tipo" className="text-sm md:text-base">Nome</label>
             <Controller
               name="tipo"
               control={control}
               render={({ field }) => (
                 <Input {...field} placeholder="Índice UV" className={errors.tipo ? "border-red-500" : ""} />
               )}
             />
             {errors.tipo && <span className="text-red-500 text-xs absolute -bottom-5 left-0">{errors.tipo?.message}</span>}
           </div>

           <div className="relative">
             <label htmlFor="descricao" className="text-sm md:text-base">Descrição</label>
             <Controller
               name="descricao"
               control={control}
               render={({ field }) => (
                 <Input {...field} placeholder="Força de raios ultravioleta" className={errors.descricao ? "border-red-500" : ""} />
               )}
             />
             {errors.descricao && <span className="text-red-500 text-xs absolute -bottom-5 left-0">{errors.descricao?.message}</span>}
           </div>
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-6">
           <div className="relative">
             <label htmlFor="criterios" className="text-sm md:text-base whitespace-nowrap">Critérios</label>
             <Controller
               name="criterios"
               control={control}
               render={({ field }) => (
                 <select 
                   {...field} 
                   value={field.value as string}
                   onChange={(e) => {
                     field.onChange(e.target.value);
                   }}
                   className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.criterios ? "border-red-500" : ""}`}
                 >
                   <option value="">Selecione</option>
                   {Object.entries(criteriosEnum).filter(([key]) => isNaN(Number(key))).map(([key, value]) => (
                     <option key={value} value={value}>{key}</option>
                   ))}
                 </select>
               )}
             />
             {errors.criterios && <span className="text-red-500 text-xs absolute -bottom-5 left-0">{errors.criterios?.message}</span>}
           </div>

           <div className="relative">
             <label htmlFor="valor_referencia" className="text-sm md:text-base whitespace-nowrap">Valor de Referência</label>
             <Controller
               name="valor_referencia"
               control={control}
               render={({ field }) => (
                 <Input 
                   type="number" 
                   {...field} 
                   value={field.value as number}
                   onChange={(e) => field.onChange(Number(e.target.value))}
                   placeholder="5" 
                   className={errors.valor_referencia ? "border-red-500" : ""}
                 />
               )}
             />
             {errors.valor_referencia && <span className="text-red-500 text-xs absolute -bottom-5 left-0">{errors.valor_referencia?.message}</span>}
           </div>

           <div className="relative">
             <label 
               htmlFor="segunda_referencia" 
               className="text-sm md:text-base whitespace-nowrap"
               style={{ 
                 display: (selectedCriteria === '1') ? 'block' : 'none'
               }}
             >
               Segunda Referência
             </label>
              <Controller
                name="segunda_referencia"
                control={control}
                render={({ field }) => (
                <Input 
                  type="number" 
                  name={field.name}
                  value={field.value as number || ''}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  onBlur={field.onBlur}
                  placeholder="7" 
                  className={errors.segunda_referencia ? "border-red-500" : ""}
                  style={{ 
                    display: (selectedCriteria === '1') ? 'block' : 'none',
                    opacity: (selectedCriteria === '1') ? 1 : 0
                  }}
                />
                )}
              />
             {errors.segunda_referencia && (
                <div className="mt-1 text-red-500 text-xs">
                  <span>{errors.segunda_referencia?.message}</span>
                </div>
              )}
           </div>
=======
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end w-full min-w-[600px]">
=======
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end w-full">
>>>>>>> 69656fd (AT-25 fix: aplicar responsividade no formulário)
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tipo" className="text-sm md:text-base">Nome</label>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Índice UV" />
              )}
            />
            {errors.tipo && <span className="text-red-500">{errors.tipo?.message}</span>}
          </div>

          <div>
            <label htmlFor="descricao" className="text-sm md:text-base">Descrição</label>
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Força de raios ultravioleta" />
              )}
            />
            {errors.descricao && <span className="text-red-500">{errors.descricao?.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label htmlFor="criterios" className="text-sm md:text-base whitespace-nowrap">Critérios</label>
            <Controller
              name="criterios"
              control={control}
              render={({ field }) => (
                <select 
                  {...field} 
                  value={field.value as string}
                  onChange={(e) => {
                    console.log("Select onChange:", e.target.value, typeof e.target.value);
                    console.log("Convertido para Number:", Number(e.target.value));
                    field.onChange(Number(e.target.value));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  {Object.entries(criteriosEnum).filter(([key]) => isNaN(Number(key))).map(([key, value]) => (
                    <option key={value} value={value}>{key}</option>
                  ))}
                </select>
              )}
            />
            {errors.criterios && <span className="text-red-500">{errors.criterios?.message}</span>}
          </div>

          <div>
            <label htmlFor="valor_referencia" className="text-sm md:text-base whitespace-nowrap">Valor de Referência</label>
            <Controller
              name="valor_referencia"
              control={control}
              render={({ field }) => (
                <Input 
                  type="number" 
                  {...field} 
                  value={field.value as number}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="5" 
                />
              )}
            />
            {errors.valor_referencia && <span className="text-red-500">{errors.valor_referencia?.message}</span>}
          </div>

          <div>
            <label 
              htmlFor="segunda_referencia" 
              className="text-sm md:text-base whitespace-nowrap"
              style={{ 
                display: (selectedCriteria == 1) ? 'block' : 'none'
              }}
            >
              Segunda Referência
            </label>
            <Controller
              name="segunda_referencia"
              control={control}
              render={({ field }) => (
              <Input 
                type="number" 
                name={field.name}
                value={field.value as number || ''}
                onChange={(e) => field.onChange(Number(e.target.value))}
                onBlur={field.onBlur}
                placeholder="7" 
                style={{ 
                  display: (selectedCriteria == 1) ? 'block' : 'none',
                  opacity: (selectedCriteria == 1) ? 1 : 0
                }}
              />
              )}
            />
            {errors.segunda_referencia && <span className="text-red-500">{errors.segunda_referencia?.message}</span>}
          </div>
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
        </div>

        <div className="hidden">
          <Controller name="publica" control={control} render={({ field }) => <input type="checkbox" checked={field.value as boolean || false} onChange={(e) => field.onChange(e.target.checked)} />} />
        </div>

       
      </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 69656fd (AT-25 fix: aplicar responsividade no formulário)
      <div className="flex gap-2 justify-end w-full">
        {paramData && onDelete && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onDelete}
          >
            Excluir tipo de alerta
          </Button>
        )}
        <Button type="submit">Salvar</Button>
      </div>
<<<<<<< HEAD
=======
      <Button type="submit">Salvar</Button>
>>>>>>> cd44923 (AT-25 feat: adicionar cadastro e edição de tipo-alerta)
=======
>>>>>>> 69656fd (AT-25 fix: aplicar responsividade no formulário)
    </form>
  );
};

export default FormTipoAlerta;
