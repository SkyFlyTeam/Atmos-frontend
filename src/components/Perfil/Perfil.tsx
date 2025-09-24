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
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface PerfilProps {
  usuarioId: number;
  open: boolean;
  onClose: () => void;
}

const Perfil: React.FC<PerfilProps> = ({ usuarioId, open, onClose }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

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
    const fetchUser = async () => {
      try {
        const data = await usuarioServices.getUsuarioById(usuarioId);
        setUsuario(data);
        reset({ nome: data.nome, email: data.email, senha: "" });
      } catch (error) {
        toast.error("Não foi possível carregar seu perfil.");
      }
    };

    if (open && usuarioId) fetchUser();
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
      {open && usuario && (
        <SideDrawer onClose={onClose} title="Meu Perfil" content={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex flex-col items-end md:w-96 w-full">
            <div className="w-full">
              <label htmlFor="nome" className="text-sm">Nome</label>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <Input {...field} className="w-full md:w-96" />
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
                  <Input {...field} className="w-full md:w-96" />
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
                  <Input type="password" {...field} placeholder="Nova senha" className="w-full md:w-96" />
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
        } />
      )}
    </>
  );
};

export default Perfil;
