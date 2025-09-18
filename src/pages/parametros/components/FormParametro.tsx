import { Parametro } from "@/interfaces/Parametros";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import { parametroServices } from "@/services/parametroServices";
import { toast } from "react-toastify";

type FormParametroProps = {
  paramData?: Parametro;
  onClose: (success: boolean) => void;
};

type FormData = z.infer<typeof formSchema>;

const formSchema = z.object({
  json_id: z.string("Json_id é obrigatório"),
  nome: z.string("Nome é obrigatório").min(4, "Npme deve conter mais de 4 caracteres"),
  unidade: z.string("Unidade é obrigatória"),
  tipo: z.string("Tipo é obrigatório").min(4, "Tipo deve conter mais de 4 caracteres"),
  offset: z.coerce.number("Offset é obrigatório").min(0, "Offset não pode ser negativo"),
  fator: z.coerce.number("Fator deve ser um número").optional(),
  polinomio: z.string().optional(),
});

const FormParametro = ({ paramData, onClose }: FormParametroProps) => {
  const { control, handleSubmit, setValue, formState: { errors, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: paramData || {}, 
  });

  const onSubmit = async (values: FormData) => {

    if(paramData){
        // TODO: Edição de parâmetro 
        return
    }else{
        try {
            const response = await parametroServices.createParametro(values as Parametro)
            toast.success("Parâmetro cadastrado com sucesso!")
            onClose(true);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            toast.error("Erro ao tentar cadastrar parâmetro.");
        }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end md:w-md w-full">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="json_id" className="text-sm md:text-base">Json_id</label>
          <Controller
            name="json_id"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="h92he932" />
            )}
          />
          {errors.json_id && <span className="text-red-500">{errors.json_id?.message}</span>}
        </div>

        <div>
          <label htmlFor="nome" className="text-sm md:text-base">Nome</label>
          <Controller
            name="nome"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Temperatura" />
            )}
          />
          {errors.nome && <span className="text-red-500">{errors.nome?.message}</span>}
        </div>

        <div>
          <label htmlFor="unidade" className="text-sm md:text-base">Unidade</label>
          <Controller
            name="unidade"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="°C" />
            )}
          />
          {errors.unidade && <span className="text-red-500">{errors.unidade?.message}</span>}
        </div>

        <div>
          <label htmlFor="tipo" className="text-sm md:text-base">Tipo</label>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Sensor Digital" />
            )}
          />
          {errors.tipo && <span className="text-red-500">{errors.tipo?.message}</span>}
        </div>

        <div className="grid grid-cols-3 gap-4 col-span-2">
            <div>
                <label htmlFor="offset" className="text-sm md:text-base">Offset</label>
                <Controller
                    name="offset"
                    control={control}
                    render={({ field }) => (
                    <Input type="number" {...field} placeholder="0.0" />
                    )}
                />
                {errors.offset && <span className="text-red-500">{errors.offset?.message}</span>}
            </div>

            <div>
            <label htmlFor="fator" className="text-sm md:text-base">Fator</label>
            <Controller
                name="fator"
                control={control}
                render={({ field }) => (
                <Input type="number" {...field} placeholder="1.0" />
                )}
            />
            {errors.fator && <span className="text-red-500">{errors.fator?.message}</span>}
            </div>

            <div>
            <label htmlFor="polinomio" className="text-sm md:text-base">Polinomio</label>
            <Controller
                name="polinomio"
                control={control}
                render={({ field }) => (
                <Input {...field} placeholder="2x-1" />
                )}
            />
            {errors.polinomio && <span className="text-red-500">{errors.polinomio?.message}</span>}
            </div>
        </div>

       
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  );
};

export default FormParametro;
