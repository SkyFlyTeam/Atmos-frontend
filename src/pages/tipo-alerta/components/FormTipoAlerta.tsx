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
  onDelete?: () => void;
};

type FormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  pk: z.coerce.number().int("PK deve ser um número inteiro").positive("PK não pode ser negativo").optional(),
  tipo: z.string("Nome é obrigatório").min(1, "Nome deve conter pelo menos 1 caractere"),
  descricao: z.string("Descrição é obrigatória").min(1, "Descrição deve conter pelo menos 1 caractere"), 
  criterios: z.string().min(1, "Critérios é obrigatório").refine((val) => val !== "", {
    message: "Selecione um critério válido"
  }),
  valor_referencia: z.string().refine((val) => val !== "" && !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Valor de referência é obrigatório e deve ser um número válido"
  }),
  segunda_referencia: z.string().optional(),
  publica: z.boolean().optional()
}).refine((data) => {
  // Se critério for "Intervalo entre" (valor 1), segunda_referencia é obrigatória
  if (data.criterios === "1") {
    return data.segunda_referencia !== "" && data.segunda_referencia !== undefined && !isNaN(Number(data.segunda_referencia));
  }
  return true;
}, {
  message: "Segunda referência é obrigatória para critério 'Intervalo entre'",
  path: ["segunda_referencia"]
}).refine((data) => {
  // Se critério for "Intervalo entre", p2 deve ser maior ou igual a p1
  if (data.criterios === "1" && data.segunda_referencia !== "" && data.valor_referencia !== "") {
    return Number(data.valor_referencia) <= Number(data.segunda_referencia);
  }
  return true;
}, {
  message: "2ª referência deve ser maior que valor de referência",
  path: ["segunda_referencia"]
})

const FormTipoAlerta = ({ paramData, onClose, onDelete }: FormTipoAlertaProps) => {
  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitSuccessful } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: paramData ? {
      ...paramData,
      valor_referencia: paramData.p1 ? String(paramData.p1) : "", 
      segunda_referencia: paramData.p2 ? String(paramData.p2) : "", 
      criterios: paramData.tipo_alarme !== undefined ? String(paramData.tipo_alarme) : ""
    } : {
      criterios: "",
      valor_referencia: "",
      segunda_referencia: ""
    }, 
  });

  const selectedCriteria = watch("criterios");

  const onSubmit = async (values: any) => {
    const processedData = {
      ...values,
      tipo_alarme: Number(values.criterios),
      p1: values.valor_referencia !== "" ? Number(values.valor_referencia) : null, 
      p2: values.criterios === "1" && values.segunda_referencia !== "" ? Number(values.segunda_referencia) : null, 
      publica: values.publica ?? false,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1 flex flex-col items-end w-full">
      <div className="w-full space-y-1">
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pb-0.5">
           <div className="relative">
             <label htmlFor="tipo" className="text-sm md:text-base">Nome</label>
             <Controller
               name="tipo"
               control={control}
               render={({ field }) => (
                 <Input {...field} placeholder="Índice UV" className={errors.tipo ? "border-red-500" : ""} />
               )}
             />
            <div className="text-red-500 text-xs mt-0.5 min-h-[12px]">{errors.tipo?.message}</div>
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
            <div className="text-red-500 text-xs mt-0.5 min-h-[12px]">{errors.descricao?.message}</div>
           </div>
        </div>

        <div className={`grid gap-1 sm:gap-2 pb-0.5 grid-cols-1 sm:grid-cols-2`}>
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
            <div className="text-red-500 text-xs mt-0.5 min-h-[12px]">{errors.criterios?.message}</div>
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
                  value={field.value as string || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="5" 
                  className={errors.valor_referencia ? "border-red-500" : ""}
                />
              )}
            />
            <div className="text-red-500 text-xs mt-0 min-h-[8px]">{errors.valor_referencia?.message}</div>
          </div>

          {selectedCriteria === '1' && (
            <div className="relative sm:col-start-2 sm:row-start-2">
              <label 
                htmlFor="segunda_referencia" 
                className="text-sm md:text-base whitespace-nowrap"
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
                   value={field.value as string || ''}
                   onChange={(e) => field.onChange(e.target.value)}
                   onBlur={field.onBlur}
                   placeholder="7" 
                   className={errors.segunda_referencia ? "border-red-500" : ""}
                 />
                 )}
               />
              <div className="text-red-500 text-xs mt-0 min-h-[8px]">{errors.segunda_referencia?.message}</div>
            </div>
          )}
        </div>

        <div className="hidden">
          <Controller name="publica" control={control} render={({ field }) => <input type="checkbox" checked={field.value as boolean || false} onChange={(e) => field.onChange(e.target.checked)} />} />
        </div>

       
      </div>
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
    </form>
  );
};

export default FormTipoAlerta;






