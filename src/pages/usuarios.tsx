import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import CreateUserModal from "@/components/CreateUserModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: number;
  name: string;
  email: string;
}

const UsuariosPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Sarah Montuani Batagioti", email: "sarah.montuanibt@gmail.com" },
    { id: 2, name: "Karen Gonçalves", email: "karen.golcalves@gmail.com" },
    { id: 3, name: "Alinne Alves Nunes", email: "alinne.alves@gmail.com" }
  ]);
  const handleCreateUser = (userData: { name: string; email: string; password: string }) => {
    // Aqui você pode adicionar a lógica para salvar o usuário
    console.log('Dados do usuário:', userData);
    
    // Simular adição de usuário
    const newUser: User = {
      id: users.length + 1,
      name: userData.name,
      email: userData.email
    };
    
    setUsers(prev => [...prev, newUser]);
    setShowCreateModal(false);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  // Filtrar usuários baseado no termo de busca
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Configurações de paginação
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white-bg w-full">
      {/* Header com Logo e Navegação */}
      <Header activeItem="/usuarios" />

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex">
          {/* Área Principal - Lista de Usuários */}
          <div className="flex-1 pr-8">
            <h1 className="text-4xl font-bold text-dark-green mb-8 font-londrina">Usuários</h1>
            
            <div className="bg-white-pure rounded-[19px] p-8 shadow-[0_4px_35px_rgba(0,0,0,0.12)]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <SearchInput
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    className="w-64"
                  />
                </div>
                <Button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green text-white-pure hover:bg-green/90 px-6 py-2 rounded-lg font-londrina"
                >
                  + Novo usuário
                </Button>
              </div>
              
              {/* Tabela de Usuários */}
              <div className="bg-white-pure rounded-[19px] p-6 shadow-[0_4px_35px_rgba(0,0,0,0.12)]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray/10 hover:bg-gray/10 border-b-2 border-gray/30">
                      <TableHead className="font-semibold text-dark-green font-londrina text-lg h-12">
                        Nome
                      </TableHead>
                      <TableHead className="font-semibold text-dark-green font-londrina text-lg h-12">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-dark-green font-londrina text-lg h-12 text-center">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray/5 border-b border-gray/20">
                        <TableCell className="text-gray-dark font-londrina text-base py-3">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-gray-dark font-londrina text-base py-3">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <div className="flex items-center justify-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 h-8 w-8 text-green hover:bg-green/10 rounded-full"
                              title="Editar usuário"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 h-8 w-8 text-red hover:bg-red/10 rounded-full"
                              title="Excluir usuário"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Paginação */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  className="mt-6"
                />
              </div>
            </div>
          </div>

          {/* Modal de Criação de Usuário */}
          <CreateUserModal
            isOpen={showCreateModal}
            onClose={handleCloseModal}
            onSubmit={handleCreateUser}
            title="Criar usuário"
          />
        </div>
      </main>
    </div>
  );
};

export default UsuariosPage;