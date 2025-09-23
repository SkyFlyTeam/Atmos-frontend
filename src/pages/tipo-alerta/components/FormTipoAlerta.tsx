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
  criterios: z.coerce.number().int("Critérios é obrigatório").min(0).max(4),
  valor_referencia: z.coerce.number("Valor de referência é obrigatório").min(0, "Valor de referência não pode ser negativo"),
  segunda_referencia: z.coerce.number().min(0, "Segunda referência não pode ser negativo").optional(),
  publica: z.boolean().optional()
})

const FormTipoAlerta = ({ paramData, onClose, onDelete }: FormTipoAlertaProps) => {
  const { control, handleSubmit, setValue, watch, formState: { errors, isSubmitSuccessful } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: paramData ? {
      ...paramData,
      valor_referencia: paramData.p1 ? Number(paramData.p1) : 0, 
      segunda_referencia: paramData.p2 ? Number(paramData.p2) : null, 
      criterios: paramData.tipo_alarme !== undefined ? String(paramData.tipo_alarme) : ""
    } : {}, 
  });

  const selectedCriteria = watch("criterios");

  const onSubmit = async (values: any) => {
    // Validação manual para intervalo entre
    if (values.criterios === 1) {
      if (values.segunda_referencia === null || values.segunda_referencia === undefined) {
        toast.error("Segunda referência é obrigatória para critério 'Intervalo entre'");
        return;
      }
      if (values.valor_referencia > values.segunda_referencia) {
        toast.error("Segunda referência não pode ser menor que referência principal");
        return;
      }
    }

    const processedData = {
      ...values,
      tipo_alarme: Number(values.criterios),
      p1: Number(values.valor_referencia), 
      p2: values.criterios === 1 ? Number(values.segunda_referencia) : null, 
      publica: values.publica ?? false,
      valor_referencia: undefined,
      segunda_referencia: undefined
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end w-full">
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
          </div>
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
