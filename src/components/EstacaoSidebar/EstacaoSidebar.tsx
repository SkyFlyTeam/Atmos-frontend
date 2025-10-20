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
import {
  estacaoFormSchema,
  EstacaoFormSchema,
} from "@/pages/estacoes/components/estacaoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { TbXboxXFilled } from "react-icons/tb";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";


import { cidadeAPIServices, CidadeItem } from "@/services/cidadeAPIServices";
import { ComboBox } from "../Combobox/Combobox";
import { coordenadasAPIServices } from "@/services/coordenadasAPIServices";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estacao?: Estacao | null;
  mode?: "create" | "edit";
  onSave?: (
    data: Omit<Estacao, "pk"> & {
      cidadeIbgeId?: number | null;
      cidadeNome?: string | null;
      cidadeUf?: string | null;
    }
  ) => void;
  userRole?: "admin" | "user";
};

export default function EstacaoSidebar({
  open,
  onOpenChange,
  estacao,
  mode = "create",
  onSave,
  userRole = "admin",
}: Props) {
  const isReadOnly = userRole === "user";
  const { parametros } = useParametros();

  const titulo = useMemo(() => {
    if (userRole === "user") return "Visualizar estação";
    if (mode === "create") return "Criar estação";
    if (mode === "edit") return "Editar estação";
    return "Gerenciar estação";
  }, [userRole, mode]);

  // Cidades (combobox)
  const [cidades, setCidades] = useState<CidadeItem[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<CidadeItem | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    control,
  } = useForm<EstacaoFormSchema>({
    resolver: (values, context, options) =>
      zodResolver(estacaoFormSchema)(values, { ...context, cidadeSelecionada }, options),
    defaultValues: {
      uuid: "",
      nome: "",
      descricao: "",
      status: "true",
      lat: "",
      long: "",
      endereco: "",
      imagemUrl: null,
      parametros: [],
    },
  });

  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [imagemRemovida, setImagemRemovida] = useState(false);
  const [parametrosSelecionados, setParametrosSelecionados] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [usingCoordinates, setUsingCoordinates] = useState(false);
  const [usingAddress, setUsingAddress] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [enderecoPreenchidoAutomaticamente, setEnderecoPreenchidoAutomaticamente] = useState(false);
  const lat = useWatch({ control, name: "lat" });
  const long = useWatch({ control, name: "long" });
  const endereco = useWatch({ control, name: "endereco" });

  const cidadeOptions = useMemo(() => {
  const base = cidades.map((cidade) => ({
    value: String(cidade.id),
    label: `${cidade.nome} - ${cidade.uf}`,
  }));

  if (
    cidadeSelecionada &&
    !base.some((c) => c.value === String(cidadeSelecionada.id))
  ) {
    // adiciona cidade temporária
    base.push({
      value: String(cidadeSelecionada.id),
      label: `${cidadeSelecionada.nome} - ${cidadeSelecionada.uf}`,
    });
  }

  return base;
}, [cidades, cidadeSelecionada]);
  // Atualiza o estado inicial baseado nos valores iniciais
  useEffect(() => {
    if (estacao) {
      const hasLatLong = !!(estacao.lat && estacao.long);
      const hasAddress = !!(estacao.endereco || estacao.cidadeIbgeId);

      setUsingCoordinates(hasLatLong);
      setUsingAddress(hasAddress);
    }
  }, [estacao]);

  // Carrega cidades ao abrir a sidebar
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const lista = await cidadeAPIServices.getAllCidades();
        setCidades(lista);
      } catch (e) {
        console.error("Erro ao carregar cidades:", e);
        toast.error("Erro ao carregar lista de cidades");
      }
    })();
  }, [open]);

  // Atualiza o estado dos campos de localização quando os valores mudam
  useEffect(() => {
    const subscription = watch((value) => {
      const hasLatLong = !!value.lat || !!value.long;
      const hasAddress = !!value.endereco || !!cidadeSelecionada;

      setUsingCoordinates(hasLatLong);
      setUsingAddress(hasAddress);

      //se ambas coordenadas estiverem preenchidas, busca o endereço
      if (value.lat && value.long && !hasAddress) {
        buscarEnderecoPorCoordenadas(value.lat, value.long);
      }

    });

    return () => subscription.unsubscribe();
  }, [watch, cidadeSelecionada, cidades]);

  // Preenche formulário ao abrir/editar
  useEffect(() => {
    if (!open) return;
  
    if (estacao) {
      // A interface Estacao já tem os campos cidadeIbgeId, cidadeNome e cidadeUf
  
      console.log("🔍 DEBUG - Dados da estação recebidos:", {
        uuid: estacao.uuid,
        nome: estacao.nome,
        lat: estacao.lat,
        long: estacao.long,
        endereco: estacao.endereco,
        cidadeIbgeId: estacao.cidadeIbgeId,
        cidadeNome: estacao.cidadeNome,
        cidadeUf: estacao.cidadeUf,
        totalCidades: cidades.length
      });
  
      // Sempre preenche o formulário, independente se as cidades estão carregadas
      const cidadeId = estacao.cidadeIbgeId ? Number(estacao.cidadeIbgeId) : null;
      const cidadeDaLista = cidades.length > 0 ? (
        cidadeId !== null
          ? cidades.find((c) => c.id === cidadeId)
          : cidades.find(
              (c) =>
                c.nome.toLowerCase() === estacao.cidadeNome?.toLowerCase() &&
                c.uf.toLowerCase() === estacao.cidadeUf?.toLowerCase()
            )
      ) : null;
  
      const cidadeDefinida =
        cidadeDaLista ||
        (estacao.cidadeNome && estacao.cidadeUf
          ? {
              id: estacao.cidadeIbgeId ?? 0,
              nome: estacao.cidadeNome,
              uf: estacao.cidadeUf,
              label: `${estacao.cidadeNome} - ${estacao.cidadeUf}`,
            }
          : null);

      console.log("🏙️ DEBUG - Cidade definida:", cidadeDefinida);
  
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
        cidadeIbgeId: cidadeDefinida ? String(cidadeDefinida.id) : null,
        cidadeNome: cidadeDefinida?.nome ?? null,
        cidadeUf: cidadeDefinida?.uf ?? null,
      });
  
      setCidadeSelecionada(cidadeDefinida);
      setImagemUrl(estacao.imagemBase64 ?? null);
      setParametrosSelecionados(estacao.parametros ?? []);
      setImagemRemovida(false);

      // Se a estação tem coordenadas mas não tem cidade, busca a cidade automaticamente
      if (estacao.lat && estacao.long && !cidadeDefinida && cidades.length > 0) {
        console.log("🔍 DEBUG - Buscando cidade automaticamente pelas coordenadas...");
        buscarEnderecoPorCoordenadas(estacao.lat, estacao.long, true); // true = apenas cidade
      }
    } else {
      reset({
        uuid: "",
        nome: "",
        descricao: "",
        status: "true",
        lat: "",
        long: "",
        endereco: "",
        imagemUrl: null,
        parametros: [],
        cidadeIbgeId: null,
        cidadeNome: null,
        cidadeUf: null,
      });
      setCidadeSelecionada(null);
      setImagemUrl(null);
      setParametrosSelecionados([]);
      setImagemRemovida(false);
    }
  }, [open, estacao, cidades, reset]);

  // Effect separado para atualizar a cidade quando as cidades são carregadas
  useEffect(() => {
    if (!open || !estacao || cidades.length === 0) return;

    if (estacao.cidadeIbgeId && !cidadeSelecionada) {
      // Se temos um cidadeIbgeId mas ainda não selecionamos a cidade, tenta encontrar
      const cidadeId = Number(estacao.cidadeIbgeId);
      const fromList = cidades.find((c) => c.id === cidadeId);
      if (fromList) {
        setCidadeSelecionada(fromList);
        // Atualiza também os valores do formulário
        setValue("cidadeIbgeId", String(fromList.id), { shouldValidate: true });
        setValue("cidadeNome", fromList.nome, { shouldValidate: true });
        setValue("cidadeUf", fromList.uf, { shouldValidate: true });
      }
    }
  }, [cidades, estacao, open, cidadeSelecionada, setValue]);

  useEffect(() => {
    if (!open) return; // Evita rodar quando o modal está fechado

    if (!lat && !long && enderecoPreenchidoAutomaticamente) {
      // Evita loop: só limpa se realmente houver algo a limpar
      if (endereco || cidadeSelecionada) {
        setValue("endereco", "");
        setCidadeSelecionada(null);
        setEnderecoPreenchidoAutomaticamente(false);
      }
    }
  }, [open, lat, long, endereco, enderecoPreenchidoAutomaticamente, cidadeSelecionada, setValue]);

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
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const maxSize = 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("A imagem deve ter no máximo 20MB");
      setTimeout(() => {
        if (e.target) e.target.value = "";
      }, 0);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagemUrl(base64);
      setImagemRemovida(false);
    };
    reader.onerror = () => {
      toast.error("Erro ao processar imagem");
    };
    reader.readAsDataURL(selectedFile);
  }

  function handleRemoveImage() {
    setImagemUrl(null);
    setImagemRemovida(true);
  }


  const buscarEnderecoPorCoordenadas = async (lat: string, long: string, apenasCidade = false) => {
    if (!lat || !long) return;

    setIsLoadingAddress(true);
    try {
      const enderecoCompleto = await coordenadasAPIServices.getCoordenadas(
        parseFloat(lat),
        parseFloat(long)
      );

      if (enderecoCompleto) {
        console.log("Endereço completo retornado:", enderecoCompleto); // Debug

        // Mapeamento de estados (nome completo -> sigla)
        const mapeamentoEstados: { [key: string]: string } = {
          'acre': 'AC',
          'alagoas': 'AL',
          'amapá': 'AP',
          'amazonas': 'AM',
          'bahia': 'BA',
          'ceará': 'CE',
          'distrito federal': 'DF',
          'espírito santo': 'ES',
          'goiás': 'GO',
          'maranhão': 'MA',
          'mato grosso': 'MT',
          'mato grosso do sul': 'MS',
          'minas gerais': 'MG',
          'pará': 'PA',
          'paraíba': 'PB',
          'paraná': 'PR',
          'pernambuco': 'PE',
          'piauí': 'PI',
          'rio de janeiro': 'RJ',
          'rio grande do norte': 'RN',
          'rio grande do sul': 'RS',
          'rondônia': 'RO',
          'roraima': 'RR',
          'santa catarina': 'SC',
          'são paulo': 'SP',
          'sergipe': 'SE',
          'tocantins': 'TO'
        };

        // Converte o estado retornado para sigla
        const estadoSigla = mapeamentoEstados[enderecoCompleto.estado.toLowerCase()] || enderecoCompleto.estado;

        console.log(`Estado convertido: "${enderecoCompleto.estado}" -> "${estadoSigla}"`); // Debug

        // Busca a cidade na lista de cidades carregadas
        const cidadeEncontrada = cidades.find((cidade) => {
          const nomeCidade = cidade.nome.toLowerCase().trim();
          const nomeRetornado = enderecoCompleto.cidade.toLowerCase().trim();
          const ufCidade = cidade.uf.toLowerCase().trim();
          const ufRetornado = estadoSigla.toLowerCase().trim();

          console.log(`Comparando: "${nomeCidade}" com "${nomeRetornado}" e "${ufCidade}" com "${ufRetornado}"`); // Debug

          // Busca exata
          if (nomeCidade === nomeRetornado && ufCidade === ufRetornado) {
            return true;
          }

          // Busca parcial (caso a cidade tenha nomes diferentes)
          if (nomeCidade.includes(nomeRetornado) || nomeRetornado.includes(nomeCidade)) {
            return ufCidade === ufRetornado;
          }

          return false;
        });

        if (cidadeEncontrada) {
          setCidadeSelecionada(cidadeEncontrada);
          // Atualiza também os valores do formulário
          setValue("cidadeIbgeId", String(cidadeEncontrada.id), { shouldValidate: true });
          setValue("cidadeNome", cidadeEncontrada.nome, { shouldValidate: true });
          setValue("cidadeUf", cidadeEncontrada.uf, { shouldValidate: true });
          // console.log("Cidade encontrada e selecionada:", cidadeEncontrada); // Debug
        } else {
          // Se não encontrar na lista, cria um item temporário com a sigla correta
          const cidadeTemporaria = {
            id: 0, // ID temporário
            nome: enderecoCompleto.cidade,
            uf: estadoSigla, // Usa a sigla convertida
            label: `${enderecoCompleto.cidade} - ${estadoSigla}`,
          };
          setCidadeSelecionada(cidadeTemporaria);
          setValue("cidadeIbgeId", "0", { shouldValidate: true });
          setValue("cidadeNome", enderecoCompleto.cidade, { shouldValidate: true });
          setValue("cidadeUf", estadoSigla, { shouldValidate: true });
          console.log("Cidade temporária criada:", cidadeTemporaria); // Debug
        }

        // Só preenche o endereço se não for apenas para buscar a cidade
        if (!apenasCidade) {
          setValue("endereco", enderecoCompleto.endereco, { shouldValidate: true });
          setEnderecoPreenchidoAutomaticamente(true);
          // toast.success("Endereço encontrado automaticamente!");
        } else {
          // toast.success("Cidade encontrada automaticamente!");
        }
      } else {
        toast.warning("Não foi possível encontrar informações para essas coordenadas");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      toast.error("Erro ao buscar informações. Tente novamente.");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  function onSubmit(data: EstacaoFormSchema) {
    const estacaoData: Omit<Estacao, "pk"> & {
      cidadeIbgeId?: number | null;
      cidadeNome?: string | null;
      cidadeUf?: string | null;
    } = {
      uuid: data.uuid,
      nome: data.nome,
      descricao: data.descricao,
      status: data.status === "true",
      lat: data.lat || null,
      long: data.long || null,
      endereco: data.endereco || null,
      parametros: data.parametros || [],
      imagemBase64: imagemRemovida ? null : imagemUrl,
      cidadeIbgeId: cidadeSelecionada?.id ?? null,
      cidadeNome: cidadeSelecionada?.nome ?? null,
      cidadeUf: cidadeSelecionada?.uf ?? null,
    };

    console.log("payload POST/PUT estação:", estacaoData); // debug

    try {
      if (mode === "create") {
        onSave?.(estacaoData);
        toast.success("Estação criada com sucesso!");
      } else if (estacao) {
        onSave?.(estacaoData);
        toast.success("Estação atualizada com sucesso!");
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar estação:", error);
      toast.error("Erro ao salvar estação. Tente novamente.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-9  overflow-y-auto bg-white">
        <SheetHeader>
          <SheetTitle className="text-[48px] font-medium text-[#00312D] font-londrina">
            {titulo}
          </SheetTitle>
        </SheetHeader>

        <form id="estacao-form" onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-5">
          {/* UUID e Nome */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#00312D] mb-1">UUID</label>
              <Input
                placeholder="CEN1234"
                {...register("uuid")}
                disabled={isReadOnly}
                className={`text-black placeholder:text-gray-300 ${isReadOnly ? "text-black" : ""} ${errors.uuid ? "border-red-500" : ""
                  }`}
              />
              {errors.uuid && <p className="text-red-500 text-xs mt-1">{errors.uuid.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#00312D] mb-1">Nome</label>
              <Input
                placeholder="Estação CEN1234"
                {...register("nome")}
                disabled={isReadOnly}
                className={`text-black placeholder:text-gray-300 ${isReadOnly ? "text-black" : ""} ${errors.nome ? "border-red-500" : ""
                  }`}
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-[#00312D] mb-1">Descrição</label>
            <Textarea
              placeholder="Estação de coleta de dados de chuva para São José dos Campos"
              {...register("descricao")}
              disabled={isReadOnly}
              className={` text-black border-gray placeholder:text-gray-300 ${isReadOnly ? "text-black" : ""} ${errors.nome ? "border-red-500" : ""
                }`}
            />
            {errors.descricao && (
              <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Status e coordenadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="w-max">
              <label className="block text-sm font-medium text-[#00312D] mb-1">Status</label>
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 mt-0.5">
                  <Checkbox
                    id="status-ativo"
                    checked={watch("status") === "true"}
                    onCheckedChange={() => setValue("status", "true", { shouldValidate: true })}
                    disabled={isReadOnly}
                  />
                  <label htmlFor="status-ativo" className="text-sm font-medium leading-none text-[#00312D]">
                    Ativo
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="status-inativo"
                    checked={watch("status") === "false"}
                    onCheckedChange={() => setValue("status", "false", { shouldValidate: true })}
                    disabled={isReadOnly}
                  />
                  <label htmlFor="status-inativo" className="text-sm font-medium leading-none text-[#00312D]">
                    Inativo
                  </label>
                </div>
              </div>
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00312D] mb-1">
                Latitude {isLoadingAddress && <span className="text-gray-500">(Buscando endereço...)</span>}
              </label>
              <Input
                type="number"
                step="any"
                placeholder="-23.18976"
                {...register("lat", {
                  onChange: (e) => {
                    if (e.target.value && !usingCoordinates) {
                      setValue("endereco", "");
                      setCidadeSelecionada(null);
                      setEnderecoPreenchidoAutomaticamente(false);
                    } else if (!e.target.value && enderecoPreenchidoAutomaticamente) {
                      // Se apagou a latitude e o endereço foi preenchido automaticamente, limpa tudo
                      setValue("endereco", "");
                      setCidadeSelecionada(null);
                      setEnderecoPreenchidoAutomaticamente(false);
                    }
                  }
                })}
                disabled={isReadOnly || (usingAddress && !enderecoPreenchidoAutomaticamente && !!watch("lat") && !!watch("long"))}
                className={`text-black placeholder:text-gray-300 ${isReadOnly || (usingAddress && !enderecoPreenchidoAutomaticamente && !!watch("lat") && !!watch("long")) ? "bg-gray-100" : ""} ${errors.lat ? "border-red-500" : ""}`}
              />
              {errors.lat && <p className="text-red-500 text-xs mt-1">{errors.lat.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#00312D] mb-1">
                Longitude {isLoadingAddress && <span className="text-gray-500">(Buscando endereço...)</span>}
              </label>
              <Input
                type="number"
                step="any"
                placeholder="-45.87654"
                {...register("long", {
                  onChange: (e) => {
                    if (e.target.value && !usingCoordinates) {
                      setValue("endereco", "");
                      setCidadeSelecionada(null);
                      setEnderecoPreenchidoAutomaticamente(false);
                    } else if (!e.target.value && enderecoPreenchidoAutomaticamente) {
                      // Se apagou a longitude e o endereço foi preenchido automaticamente, limpa tudo
                      setValue("endereco", "");
                      setCidadeSelecionada(null);
                      setEnderecoPreenchidoAutomaticamente(false);
                    }
                  }
                })}
                disabled={isReadOnly || (usingAddress && !enderecoPreenchidoAutomaticamente && !!watch("lat") && !!watch("long"))}
                className={`text-black placeholder:text-gray-300 ${isReadOnly || (usingAddress && !enderecoPreenchidoAutomaticamente && !!watch("lat") && !!watch("long")) ? "bg-gray-100" : ""} ${errors.long ? "border-red-500" : ""}`}
              />
              {errors.long && <p className="text-red-500 text-xs mt-1">{errors.long.message}</p>}
            </div>
          </div>

          {/* Cidade + Endereço */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Cidade */}
            <div className="w-full md:basis-1/3 md:flex-shrink-0">
              <label className="block text-sm font-medium text-[#00312D] mb-1">Cidade</label>
              <ComboBox
                options={cidadeOptions}
                value={cidadeSelecionada?.id ? String(cidadeSelecionada.id) : ""} // Mudança: usar "" em vez de undefined
                onSelect={(val) => {
                  if (usingCoordinates && enderecoPreenchidoAutomaticamente) return;
                  const selecionada = cidades.find((c) => String(c.id) === val);
                  if (selecionada) {
                    setCidadeSelecionada(selecionada);
                    setEnderecoPreenchidoAutomaticamente(false);

                    setValue("cidadeIbgeId", String(selecionada.id), { shouldValidate: true });
                    setValue("cidadeNome", selecionada.nome, { shouldValidate: true });
                    setValue("cidadeUf", selecionada.uf, { shouldValidate: true });

                    if (!usingAddress) {
                      setValue("lat", "");
                      setValue("long", "");
                    }
                  }
                }}
                disabled={isReadOnly || (usingCoordinates && enderecoPreenchidoAutomaticamente)}
                placeholder="Selecione uma cidade"
                emptyText="Nenhuma cidade encontrada"
                searchPlaceholder="Pesquisar cidade..."
                className={`${errors.cidadeIbgeId ? "border-red-500" : ""} ${isReadOnly || (usingCoordinates && enderecoPreenchidoAutomaticamente) ? "bg-gray-100" : ""} `}
              />
              {errors.cidadeIbgeId && (
                <p className="text-red-500 text-xs mt-1">{errors.cidadeIbgeId.message}</p>
              )}
            </div>

            {/* Endereço */}
            <div className="w-full md:flex-grow">
              <label className=" block text-sm font-medium text-[#00312D] mb-1">Endereço</label>
              <Input
                placeholder="Bairro, rua e número"
                {...register("endereco", {
                  onChange: (e) => {
                    if (e.target.value && !usingAddress) {
                      setEnderecoPreenchidoAutomaticamente(false); // Marca como preenchido manualmente
                    }
                  }
                })}
                disabled={isReadOnly || (usingCoordinates && enderecoPreenchidoAutomaticamente)}
                className={`text-black placeholder:text-gray-300 ${isReadOnly || (usingCoordinates && enderecoPreenchidoAutomaticamente) ? "bg-gray-100" : ""} ${errors.endereco ? "border-red-500" : ""}`}
              />
              {errors.endereco && (
                <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>
              )}
            </div>
          </div>

          {/* Imagem */}
          <div className="flex gap-4 items-start">
            <div className="border-2 border-[#72BF01] rounded-3xl h-58 w-100 flex items-center justify-center overflow-hidden bg-gray-200">
              {imagemUrl ? (
                <img src={imagemUrl} alt="Pré-visualização" className="h-full w-full object-cover" />
              ) : !imagemRemovida && estacao?.imagemBase64 ? (
                <img src={estacao.imagemBase64} alt={estacao.nome} className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400 font-semibold">SEM IMAGEM</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                className="bg-transparent text-[#72BF01] rounded-2xl font-semibold border-[#72BF01] border-[2px] hover:text-[#5a9901] hover:bg-transparent "
                onClick={handleRemoveImage}
                disabled={isReadOnly || (!imagemUrl && !estacao?.imagemBase64)}
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-[200px] justify-between bg-white rounded-xl!">
                        Selecionar...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar parâmetro..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>Nenhum parâmetro encontrado.</CommandEmpty>
                          <CommandGroup>
                            {parametros
                              .filter((p) => p.nome && !parametrosSelecionados.includes(p.nome))
                              .map((p) => (
                                <CommandItem
                                  key={p.pk}
                                  value={p.nome}
                                  onSelect={(val) => {
                                    handleAddParametro(val);
                                  }}
                                >
                                  {p.nome} {p.unidade ? `(${p.unidade})` : ""}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      parametrosSelecionados.includes(p.nome) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <span className="text-sm text-gray-500 italic">Nenhum parâmetro cadastrado no sistema</span>
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
                      className="text-[#72BF01] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold "
                      onClick={() => handleRemoveParametro(p)}
                      aria-label={`Remover ${p}`}
                    >
                      <TbXboxXFilled className="w-5 h-5 text-[#00312D] hover:text-[#72BF01] cursor-pointer" />
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
              <Button type="submit" form="estacao-form" className="bg-[#72BF01] hover:bg-[#5a9901] rounded-xl">
                Salvar
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
