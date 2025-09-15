import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: { name: string; email: string; password: string }) => void;
  title?: string;
  className?: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "Criar usuário",
  className = ""
}) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", password: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300 ${className}`}>
      <div className="absolute right-0 top-0 h-full w-96 bg-white-pure shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[34px] font-bold text-black font-londrina-solid">{title}</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClose}
              className="text-gray-dark hover:text-dark-green"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-dark-green font-medium font-londrina">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                className="font-londrina"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-dark-green font-medium font-londrina">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite o email"
                className="font-londrina"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-dark-green font-medium font-londrina">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite a senha"
                className="font-londrina"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="bg-green text-white-pure hover:bg-green/90 px-8 py-2 rounded-lg font-londrina"
              >
                Salvar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
