"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation"; // 👈 App Router
import SideDrawer from "@/components/SideDrawer/SideDrawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usuarioServices } from "@/services/usuarioServices";
import { Usuario } from "@/interfaces/Usuarios";

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
});

type FormData = z.infer<typeof formSchema>;

const Perfil = () => {
  const router = useRouter(); // 👈 hook do Next
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [open] = useState(true); // sempre começa aberto

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: "", email: "", senha: "" },
  });

  // 🔹 Buscar usuário (mock id=1)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await usuarioServices.getUsuarioById(1);
        setUsuario(data);
        reset({ nome: data.nome, email: data.email, senha: "" }); // senha não vem preenchida
      } catch (error) {
        toast.error("Não foi possível carregar seu perfil.");
      }
    };
    if (open) fetchUser();
  }, [open, reset]);

  const onSubmit = async (values: FormData) => {
    if (!usuario) return;

    try {
      const payload: Usuario = {
        ...usuario,
        nome: values.nome,
        email: values.email,
        senha: values.senha || usuario.senha, // mantém senha antiga se não trocar
      };

      await usuarioServices.updateUsuario(payload);
      toast.success("Perfil atualizado com sucesso!");
      router.back(); // 👈 volta depois de salvar
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao salvar perfil.");
    }
  };

  return (
    <>
      {open && (
        <SideDrawer
          onClose={() => router.back()} // 👈 fecha e volta para a página anterior
          title="Meu Perfil"
          content={
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col"
            >
              <div>
                <label className="text-sm">Nome</label>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.nome && (
                  <span className="text-red-500">{errors.nome.message}</span>
                )}
              </div>

              <div>
                <label className="text-sm">Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="text-sm">Trocar senha</label>
                <Controller
                  name="senha"
                  control={control}
                  render={({ field }) => (
                    <Input type="password" {...field} placeholder="Nova senha" />
                  )}
                />
                {errors.senha && (
                  <span className="text-red-500">{errors.senha.message}</span>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          }
        />
      )}
    </>
  );
};

export default Perfil;
