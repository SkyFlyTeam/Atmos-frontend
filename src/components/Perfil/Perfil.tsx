"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usuarioServices } from "@/services/usuarioServices";
import { Usuario } from "@/interfaces/Usuarios";
import SideDrawer from "@/components/SideDrawer/SideDrawer";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().optional(),
});

// Helper para decodificar payload de JWT (base64url)
const decodeJwtPayload = (token: string): any | null => {
  try {
    const raw = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const payloadPart = raw.split('.')[1];
    if (!payloadPart) return null;
    let base = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    while (base.length % 4 !== 0) base += '=';
    const json = JSON.parse(atob(base));
    return json;
  } catch (e) {
    console.error('Erro ao decodificar payload JWT (Perfil):', e);
    return null;
  }
};

type FormData = z.infer<typeof formSchema>;

interface PerfilProps {
  usuarioId?: number;
  open: boolean;
  onClose: () => void;
}

const Perfil: React.FC<PerfilProps> = ({ usuarioId, open, onClose }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [resolvedId, setResolvedId] = useState<number | null>(usuarioId ?? null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", senha: "" },
  });

  useEffect(() => {
    const resolveId = async (): Promise<number | null> => {
      // 1) ID passado por props
      if (usuarioId) return usuarioId;

      // 2) Tenta localStorage.user
      let emailFromStore: string | null = null;
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          const id = parsed?.pk ?? parsed?.id ?? null;
          emailFromStore = parsed?.email ?? null;
          if (id) return Number(id);
        }
      } catch (e) {
        console.warn('Perfil: user no localStorage inválido.');
      }

      // 3) Tenta decodificar o token JWT
      try {
        const token = typeof window !== 'undefined' ? (localStorage.getItem('token') || '') : '';
        if (token) {
          const payload = decodeJwtPayload(token);
          if (payload) {
            const id = payload?.pk ?? payload?.id ?? payload?.sub ?? null;
            if (!emailFromStore && payload?.email) emailFromStore = payload.email;
            if (id) return Number(id);
          }
        }
      } catch (e) {
        console.warn('Perfil: não foi possível obter ID do token.');
      }

      // 4) Fallback por email: busca usuários e encontra pelo email
      if (emailFromStore) {
        try {
          const all = await usuarioServices.getAllUsuarios();
          const found = Array.isArray(all)
            ? all.find((u: any) => (u?.email || '').toLowerCase() === emailFromStore!.toLowerCase())
            : null;
          if (found?.pk || found?.id) return Number(found.pk ?? found.id);
        } catch (e) {
          console.error('Perfil: erro ao buscar usuários para resolver ID:', e);
        }
      }

      return null;
    };

    const fetchUser = async (id: number) => {
      try {
        const data = await usuarioServices.getUsuarioById(id);
        setUsuario(data);
        reset({ nome: data.nome, email: data.email, senha: "" });
      } catch (error) {
        console.error('Perfil: erro ao carregar usuário:', error);
        toast.error("Não foi possível carregar seu perfil.");
      }
    };

    if (open) {
      setLoading(true);
      resolveId()
        .then((id) => {
          setResolvedId(id);
          if (id) return fetchUser(id);
          toast.error("Não foi possível identificar o usuário logado.");
          return null;
        })
        .finally(() => setLoading(false));
    }
  }, [open, usuarioId, reset]);

  const onSubmit = async (values: FormData) => {
    if (!usuario) return;

    try {
      const payload: Usuario = {
        ...usuario,
        nome: values.nome,
        email: values.email,
        senha: values.senha || usuario.senha,
      };

      await usuarioServices.updateUsuario(payload);
      toast.success("Perfil atualizado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao salvar perfil.");
    }
  };

  return (
    <>
      {open && (
        <SideDrawer
          onClose={onClose}
          title="Meu perfil"
          content={
            loading || !usuario ? (
              <div className="p-4 text-sm text-gray-600">Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end  w-full">
                <div className="w-full">
                  <label htmlFor="nome" className="text-sm">Nome</label>
                  <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} className="w-full " />
                    )}
                  />
                  {errors.nome && <span className="text-red-500">{errors.nome.message}</span>}
                </div>

                <div className="w-full">
                  <label htmlFor="email" className="text-sm">Email</label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} className="w-full " />
                    )}
                  />
                  {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>

                <div className="w-full">
                  <label htmlFor="senha" className="text-sm">Trocar senha</label>
                  <Controller
                    name="senha"
                    control={control}
                    render={({ field }) => (
                      <Input type="password" {...field} placeholder="Nova senha" className="w-full " />
                    )}
                  />
                  {errors.senha && <span className="text-red-500">{errors.senha.message}</span>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-auto"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </form>
            )
          }
        />
      )}
    </>
  );
};

export default Perfil;
