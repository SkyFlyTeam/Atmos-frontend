import React, { useState, useEffect } from 'react';
import SidePanel from './SidePanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Usuario } from '@/interfaces/Usuarios';
import { usuarioServices } from '@/services/usuarioServices';
import { toast } from 'react-toastify';

type UsuarioModalProps = {
  open: boolean;
  onClose: () => void;
  usuario?: Usuario | null; // Se for null/undefined é criação, se tiver dados é edição
  onSuccess?: () => void; // Callback após sucesso
  onDelete?: (usuario: Usuario) => void; // Callback para deletar usuário
};

const UsuarioModal: React.FC<UsuarioModalProps> = ({
  open,
  onClose,
  usuario,
  onSuccess,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!usuario;

  // Resetar form quando modal abre/fecha ou muda usuário
  useEffect(() => {
    if (open) {
      if (usuario) {
        setFormData({
          nome: usuario.nome,
          email: usuario.email,
          senha: '' // Não preencher senha por segurança
        });
      } else {
        setFormData({
          nome: '',
          email: '',
          senha: ''
        });
      }
      setErrors({});
    }
  }, [open, usuario]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isEditing && !formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing && usuario) {
        // Atualizar usuário existente
        const updateData = {
          ...usuario,
          nome: formData.nome,
          email: formData.email,
          ...(formData.senha && { senha: formData.senha }) // Só inclui senha se foi preenchida
        };
        await usuarioServices.updateUsuario(updateData);
        toast.success("Usuário editado com sucesso!")
      } else {
        // Criar novo usuário
        await usuarioServices.createUsuario(formData);
        toast.success("Usuário criado com sucesso!")
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      // Aqui você pode adicionar um toast ou notificação de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (usuario && onDelete) {
      onDelete(usuario);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar usuário' : 'Criar usuário'}
    >
      {/* Wrapper flexível para conteúdo + botões */}
      <div className="flex flex-col h-full">
        {/* Conteúdo do formulário */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-dark-cyan font-medium">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Vinicius Alves Nunes da Silva"
                className={`w-full px-4 py-3 rounded-lg border ${errors.nome ? 'border-red-500' : 'border-gray-300'} focus:border-green focus:ring-1 focus:ring-green font-lato`}
              />
              {errors.nome && <span className="text-red-500 text-sm">{errors.nome}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-dark-cyan font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="vinny@gmail.com"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-green focus:ring-1 focus:ring-green font-lato`}
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-dark-cyan font-medium">
                {isEditing ? 'Trocar Senha' : 'Senha'}
                {isEditing && <span className="text-gray-500 text-sm"></span>}
              </Label>

              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleInputChange('senha', e.target.value)}
                placeholder={isEditing ? "********" : "Senha@123"}
                className={`w-full px-4 py-3 rounded-lg border ${errors.senha ? 'border-red-500' : 'border-gray-300'} focus:border-green focus:ring-1 focus:ring-green font-lato`}
              />
              {errors.senha && <span className="text-red-500 text-sm">{errors.senha}</span>}
              {/* Botões de ação abaixo da senha, alinhados à direita */}
              <div className="flex justify-end pt-2 gap-2">
                {isEditing && (
                  <Button
                    variant={'destructive'}
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Excluir usuário
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  type='submit'
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé removido (botões estão abaixo da senha) */}
      </div>
    </SidePanel>
  );
};

export default UsuarioModal;
