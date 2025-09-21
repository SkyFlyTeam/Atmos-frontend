"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Estacao } from "@/interfaces/Estacoes";
import { useParametros } from "@/hooks/useParametros";
import { estacaoFormSchema, EstacaoFormSchema } from "@/schemas/estacaoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TbXboxXFilled } from "react-icons/tb";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estacao?: Estacao | null;
  mode?: "create" | "edit";
  onSave?: (data: Estacao) => void;
  userRole?: "admin" | "user";
};

// Parâmetros serão carregados do backend via hook

export default function EstacaoSidebar({
  open,
  onOpenChange,
  estacao,
  mode = "create",
  onSave,
  userRole = "admin",
}: Props) {
  const isReadOnly = userRole === "user";
  const { parametros, loading: parametrosLoading } = useParametros();

  const titulo = useMemo(() => {
    if (userRole === "user") return "Visualizar estação";
    return "Gerenciar estação";
  }, [userRole]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EstacaoFormSchema>({
    resolver: zodResolver(estacaoFormSchema),
    defaultValues: {
      uuid: "",
      nome: "",
      descricao: "",
      status: "",
      lat: "",
      long: "",
      endereco: "",
      imagemUrl: null,
      parametros: [],
    },
  });

  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [parametrosSelecionados, setParametrosSelecionados] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    
    if (!open) return;
    if (estacao) {
      reset({
        uuid: estacao.uuid ?? "",
        nome: estacao.nome ?? "",
        descricao: estacao.descricao ?? "",
        status: estacao.status ? "true" : "false",
        lat: estacao.lat ?? "",
        long: estacao.long ?? "",
        endereco: estacao.endereco ?? "",
        imagemUrl: null,
        parametros: estacao.parametros ?? [],
      });
      setImagemUrl(null);
      setParametrosSelecionados(estacao.parametros ?? []);
    } else {
      reset({
        uuid: "",
        nome: "",
        descricao: "",
        status: "",
        lat: "",
        long: "",
        endereco: "",
        imagemUrl: null,
        parametros: [],
      });
      setImagemUrl(null);
      setParametrosSelecionados([]);
    }
  }, [open, estacao, reset]);

  function handleAddParametro(value: string) {
    if (!value) return;
    const novosParametros = parametrosSelecionados.includes(value)
      ? parametrosSelecionados
      : [...parametrosSelecionados, value];
    setParametrosSelecionados(novosParametros);
    setValue("parametros", novosParametros, { shouldValidate: true });
  }

  function handleRemoveParametro(value: string) {
    const novosParametros = parametrosSelecionados.filter((p) => p !== value);
    setParametrosSelecionados(novosParametros);
    setValue("parametros", novosParametros, { shouldValidate: true });
  }

  function handleChooseImage() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagemUrl(url);
    setValue("imagemUrl", url);
  }

  function handleRemoveImage() {
    setImagemUrl(null);
    setValue("imagemUrl", null);
  }

  function onSubmit(data: EstacaoFormSchema) {
    // Converter para Estacao
    const estacaoData: Estacao = {
      pk: estacao?.pk || 0,
      uuid: data.uuid,
      nome: data.nome,
      descricao: data.descricao,
      status: data.status === "true", // Converter string para boolean
      lat: data.lat || null,
      long: data.long || null,
      endereco: data.endereco || null,
      parametros: data.parametros,
    };
    onSave?.(estacaoData);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-6 overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle className="text-[48px] font-medium text-[#00312D] font-londrina">{titulo}</SheetTitle>
        </SheetHeader>

        <form id="estacao-form" onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-5">
          {/* Linha UUID e Nome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#00312D] mb-1">UUID</label>
              <Input
                placeholder="CEN1234"
                {...register("uuid")}
                disabled={isReadOnly}
                className={`text-black placeholder:text-gray-300 ${isReadOnly ? 'text-black' : ''} ${errors.uuid ? 'border-red-500' : ''}`}
              />
              {errors.uuid && (
                <p className="text-red-500 text-xs mt-1">{errors.uuid.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#00312D] mb-1">Nome</label>
              <Input
                placeholder="Estação CEN1234"
                {...register("nome")}
                disabled={isReadOnly}
                className={`text-black placeholder:text-gray-300 ${isReadOnly ? 'text-black' : ''} ${errors.nome ? 'border-red-500' : ''}`}
              />
              {errors.nome && (
                <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[#00312D] mb-1">Descrição</label>
            <textarea
              placeholder="Estação de coleta de dados de chuva para São José dos Campos"
              {...register("descricao")}
              disabled={isReadOnly}
              className={`file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-black placeholder:text-gray-300 ${isReadOnly ? 'text-black' : ''} ${errors.descricao ? 'border-red-500' : ''}`}
            />
            {errors.descricao && (
              <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Status e coordenadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Status */}
            <fieldset className="w-max">
              <legend className="block text-sm font-medium text-[#00312D] mb-1">Status</legend>
              <div className="flex flex-col text-sm">
                <label className="flex items-center gap-2 text-[#00312D]">
                  <input
                    type="radio"
                    {...register("status")}
                    value="true"
                    className={ `accent-[#00312D]  `}
                    disabled={isReadOnly}
                  />
                  Ativo
                </label>
                <label className="flex items-center gap-2 text-[#00312D]">
                  <input
                    type="radio"
                    {...register("status")}
                    value="false"
                    className={ `accent-[#00312D]`}
                    disabled={isReadOnly}
                  />
                  Inativo
                </label>
              </div>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </fieldset>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-[#00312D] mb-1">Latitude</label>
              <Input
                placeholder="-23.18976"
                {...register("lat")}
                disabled={isReadOnly}
                className={`text-black placeholder:text-gray-300 ${isReadOnly ? 'text-black' : ''} ${errors.lat ? 'border-red-500' : ''}`}
              />
              {errors.lat && (
                <p className="text-red-500 text-xs mt-1">{errors.lat.message}</p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-[#00312D] mb-1">Longitude</label>
              <Input
                placeholder="-45.87654"
                {...register("long")}
                disabled={isReadOnly}
                className={`text-black placeholder:text-gray-300 ${isReadOnly ? 'text-black' : ''} ${errors.long ? 'border-red-500' : ''}`}
              />
              {errors.long && (
                <p className="text-red-500 text-xs mt-1">{errors.long.message}</p>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-sm font-medium text-[#00312D] mb-1">Endereço</label>
            <Input
              placeholder="Praça Rui Barbosa, São José dos Campos, SP"
              {...register("endereco")}
              disabled={isReadOnly}
              className={`text-black placeholder:text-gray-300 ${isReadOnly ? 'text-black' : ''} ${errors.endereco ? 'border-red-500' : ''}`}
            />
            {errors.endereco && (
              <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>
            )}
          </div>

          {/* Imagem */}
          <div className="flex gap-4 items-start">
            {/* Caixa da imagem */}
            <div className="border-2 border-[#72BF01] rounded-3xl h-58 w-100 flex items-center justify-center overflow-hidden bg-gray-200">
              {imagemUrl ? (
                <img
                  src={imagemUrl}
                  alt="Pré-visualização"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 font-semibold">SEM IMAGEM</span>
              )}
            </div>

            {/* Botões ao lado */}
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                className="bg-transparent text-[#72BF01] rounded-2xl font-semibold border-[#72BF01] border-[2px] hover:text-[#5a9901] hover:bg-transparent "
                onClick={handleRemoveImage}
                disabled={isReadOnly || !imagemUrl}
              >
                Remover foto
              </Button>
              <Button
                type="button"
                className="bg-[#72BF01] text-white hover:bg-[#5a9901] rounded-2xl "
                onClick={handleChooseImage}
                disabled={isReadOnly}
              >
                Alterar foto
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Parâmetros */}
          <div>
            <h3 className="text-3xl font-medium text-[#00312D] mb-3 font-londrina">Parâmetros</h3>

            {!isReadOnly && (
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm text-[#00312D]">Adicionar parâmetros</label>

                
                {parametros.length > 0 ? (
                  <select
                    className="h-9 rounded-md border border-input bg-white text-gray-900 px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    defaultValue=""
                    onChange={(e) => {
                      handleAddParametro(e.target.value);
                      // reset to placeholder
                      e.currentTarget.selectedIndex = 0;
                    }}
                  >
                    <option className="text-gray-500" value="" disabled>
                      Selecionar
                    </option>
                    {parametros
                      .filter(p => p.nome && !parametrosSelecionados.includes(p.nome))
                      .map((p) => (
                        <option key={p.pk} value={p.nome} className="text-black">
                          {p.nome} {p.unidade ? `(${p.unidade})` : ''}
                        </option>
                      ))}
                  </select>
                ) : (
                  <span className="text-sm text-gray-500 italic">
                    Nenhum parâmetro cadastrado no sistema
                  </span>

                  
                )}
              </div>
              
            )}

            {errors.parametros && (
              <p className="text-red-500 text-xs mt-1">{errors.parametros.message}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {parametrosSelecionados.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center gap-3 rounded-xl bg-[#72BF01]/30 px-3 py-2 text-sm text-[#00312D] font-medium"
                >
                  {p}
                  {!isReadOnly && (
                    <button
                      type="button"
                      className="text-[#72BF01]   rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold "
                      onClick={() => handleRemoveParametro(p)}
                      aria-label={`Remover ${p}`}
                    >
                      <TbXboxXFilled className="w-5 h-5 text-[#00312D] hover:text-[#72BF01]" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        </form>

        {!isReadOnly && (
          <SheetFooter className="mt-6 p-0">
            <div className="flex gap-2 justify-end w-full">
              <Button type="button" className="bg-red-700 hover:bg-red-800 rounded-xl" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="estacao-form" className="bg-[#72BF01] hover:bg-[#5a9901] rounded-xl">Salvar</Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}