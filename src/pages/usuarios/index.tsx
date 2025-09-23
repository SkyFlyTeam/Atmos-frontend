import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import ButtonIconRight from "@/components/Buttons/ButtonIconRight";
import { FaPlus } from "react-icons/fa";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import UsuarioModal from "@/components/Modal/UsuarioModal";
import Modal from "@/components/Modal/Modal";
import ActionButtons from "@/components/Buttons/ActionButtons";
import { Usuario } from "@/interfaces/Usuarios";
import { usuarioServices, testApiConnection } from "@/services/usuarioServices";
import { Card } from "@/components/ui/card";
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsuariosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conectivityStatus, setConnectivityStatus] = useState<string>('Verificando...');

  // Testar conectividade da API
  const checkApiConnection = async () => {
    const result = await testApiConnection();
    setConnectivityStatus(result.message);
    return result.connected;
  };

  // Carregar usuários do backend
  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Primeiro testa a conectividade
      const isConnected = await checkApiConnection();
      
      if (!isConnected) {
        setError(conectivityStatus);
        setUsuarios([]);
        return;
      }
      
      const data = await usuarioServices.getAllUsuarios();
      console.log('Dados recebidos:', data); // Debug log
      
      // Garante que sempre seja um array
      const usuariosArray = Array.isArray(data) ? data : [];
      setUsuarios(usuariosArray);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError('Erro ao conectar com a API. Verifique se o servidor backend está rodando na porta 3000.');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  }, [conectivityStatus]);

  // Carregar usuários na inicialização
  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  // Handlers
  const handleCreateUser = () => {
    setSelectedUsuario(null);
    setShowModal(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleDeleteUser = (usuario: Usuario) => {
    setUsuarioToDelete(usuario);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    if (usuarioToDelete) {
      try {
        await usuarioServices.deleteUsuario(usuarioToDelete.pk);
        await loadUsuarios(); // Recarregar lista
        setShowConfirmDelete(false);
        setUsuarioToDelete(null);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        setError('Erro ao deletar usuário. Verifique se o servidor backend está rodando.');
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleModalSuccess = () => {
    loadUsuarios(); // Recarregar lista após sucesso
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUsuario(null);
  };

  // Filtrar usuários baseado no termo de busca
  const filteredUsers = (usuarios || []).filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Garantir que a busca considere todas as páginas: ao digitar, volte para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Evitar página fora do intervalo ao mudar filtro/dados
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages === 0 ? 1 : totalPages);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white-bg w-full overflow-x-hidden">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex">
            <div className="flex-1 pr-0 md:pr-8 w-full">
              <h1 className="text-4xl font-bold text-dark-green mb-8 font-londrina">Usuários</h1>
              <Card className="flex flex-col gap-3 md:p-6 p-0 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none">
                <div className="w-full flex justify-between md:items-center items-end flex-wrap gap-4 md:flex-row flex-col-reverse mb-6">
                  <div className="relative bg-white md:w-sm w-full animate-pulse">
                    <div className="absolute left-2 top-3 h-4 w-4 bg-gray/30 rounded" />
                    <div className="pl-8 w-full h-10 rounded-md bg-gray/20" />
                  </div>
                  <div className="h-10 w-44 rounded-[18px] bg-gray/20 animate-pulse" />
                </div>
                <div className="w-full space-y-3">
                  {/* Header skeleton */}
                  <div className="hidden md:grid grid-cols-12 gap-4 bg-gray/10 rounded-md p-4">
                    <div className="col-span-5 h-6 bg-gray/20 rounded" />
                    <div className="col-span-5 h-6 bg-gray/20 rounded" />
                    <div className="col-span-2 h-6 bg-gray/20 rounded" />
                  </div>
                  {/* Rows skeleton */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray/10">
                      <div className="col-span-5 h-5 bg-gray/20 rounded" />
                      <div className="col-span-5 h-5 bg-gray/20 rounded" />
                      <div className="col-span-2 h-5 bg-gray/20 rounded" />
                    </div>
                  ))}
                  {/* Cards skeleton (mobile) */}
                  <div className="md:hidden flex flex-col gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-full p-4 rounded-md bg-white shadow animate-pulse">
                        <div className="h-4 w-1/3 bg-gray/20 rounded mb-2" />
                        <div className="h-4 w-2/3 bg-gray/20 rounded mb-2" />
                        <div className="h-8 w-24 bg-gray/20 rounded mt-3 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-bg w-full overflow-x-hidden">
      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex">
          {/* Área Principal - Lista de Usuários */}
          <div className="flex-1 pr-8">
            <h1 className="text-4xl font-bold text-dark-green mb-8 font-londrina">Usuários</h1>
            
            <Card className="flex flex-col gap-3 md:p-6 p-0 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none">
              <div className="w-full flex justify-between md:items-center items-end flex-wrap gap-4 md:flex-row flex-col-reverse mb-6">
                <SearchInput
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="md:w-sm w-full"
                />
                <ButtonIconRight 
                  label="Novo Usuário"
                  onClick={handleCreateUser}
                  icon={<FaPlus className="!w-3 !h-3" />}
                />
              </div>
              
              {/* Lista responsiva de Usuários */}
              <div className="w-full">
                {/* Tabela para telas médias e maiores */}
                <div className="hidden md:block overflow-hidden rounded-md border">
                  <Table className="table-fixed w-full">
                    <colgroup>
                      <col className="w-[45%]" />
                      <col className="w-[45%]" />
                      <col className="w-[10%]" />
                    </colgroup>
                    <TableHeader>
                      <TableRow className="bg-gray/10 hover:bg-gray/10 border-b-2 border-gray/30">
                        <TableHead className="font-semibold text-dark-cyan font-londrina text-lg h-12">
                          Nome
                        </TableHead>
                        <TableHead className="font-semibold text-dark-cyan font-londrina text-lg h-12">
                          Email
                        </TableHead>
                        <TableHead className="font-semibold text-dark-cyan font-londrina text-lg h-12 text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {error && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-dark-cyan py-8">
                            <div className="flex flex-col items-center space-y-3">
                              <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-center">
                                <p className="text-red-600 font-medium">{error}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                  O frontend está rodando em <code>http://localhost:3001</code><br/>
                                  Certifique-se de que o servidor backend está rodando em <code>http://localhost:3000</code>
                                </p>
                                <button 
                                  onClick={loadUsuarios}
                                  className="mt-3 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors"
                                >
                                  Tentar novamente
                                </button>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!error && paginatedUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="p-4 h-24 text-center">
                            <div className="flex flex-col gap-3 justify-center items-center">
                              <Image
                                src="/sem-dados.svg"
                                alt="Imagem sem dados"
                                width={400}
                                height={300}
                              />
                              <span style={{fontFamily: "Londrina Solid"}} className="text-2xl text-dark-cyan">Oops! Parece que não tem dados aqui!</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!error && paginatedUsers.map((usuario) => (
                        <TableRow key={usuario.pk} className="hover:bg-gray/5 border-b border-gray/20">
                          <TableCell className="text-dark-cyan font-londrina text-base py-3">
                            {usuario.nome}
                          </TableCell>
                          <TableCell className="text-dark-cyan font-londrina text-base py-3">
                            {usuario.email}
                          </TableCell>
                          <TableCell className="text-right py-3">
                            <div className="flex justify-end gap-2">
                              <ActionButtons
                                onEdit={() => handleEditUser(usuario)}
                                onDelete={() => handleDeleteUser(usuario)}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Cards para telas pequenas */}
                <div className="md:hidden flex flex-col gap-3">
                  {error ? (
                    <div className="text-center text-dark-cyan py-6">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-center">
                          <p className="text-red-600 font-medium">{error}</p>
                          <p className="text-gray-500 text-sm mt-1">
                            O frontend está rodando em <code>http://localhost:3001</code><br/>
                            Certifique-se de que o servidor backend está rodando em <code>http://localhost:3000</code>
                          </p>
                          <button 
                            onClick={loadUsuarios}
                            className="mt-3 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors"
                          >
                            Tentar novamente
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : paginatedUsers.length === 0 ? (
                    <div className="p-4">
                      <div className="flex flex-col gap-3 justify-center items-center">
                        <Image
                          src="/sem-dados.svg"
                          alt="Imagem sem dados"
                          width={400}
                          height={300}
                        />
                        <span style={{fontFamily: "Londrina Solid"}} className="text-2xl text-dark-cyan">Oops! Parece que não tem dados aqui!</span>
                      </div>
                    </div>
                  ) : (
                    paginatedUsers.map((usuario) => (
                      <Card key={usuario.pk} className="w-full p-4 shadow">
                        <div className="flex justify-between text-sm py-2">
                          <strong className="text-gray-600">Nome:</strong>
                          <span className="text-dark-cyan font-londrina">{usuario.nome}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2">
                          <strong className="text-gray-600">Email:</strong>
                          <span className="text-dark-cyan font-londrina">{usuario.email}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2">
                          <strong className="text-gray-600">Ações:</strong>
                          <div className="flex gap-2">
                            <ActionButtons
                              onEdit={() => handleEditUser(usuario)}
                              onDelete={() => handleDeleteUser(usuario)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* Contador e Paginação */}
                <div className="w-full flex items-center justify-between flex-wrap gap-y-2 mt-6">
                  <span className="text-gray">{filteredUsers.length} registros</span>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-0"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Modal de Usuário */}
          <UsuarioModal
            open={showModal}
            onClose={handleCloseModal}
            usuario={selectedUsuario}
            onSuccess={handleModalSuccess}
            onDelete={handleDeleteUser}
          />

          {/* Modal de Confirmação de Exclusão */}
          {showConfirmDelete && usuarioToDelete && (
            <Modal 
              title="Atenção!"
              content={
                <div>
                  <span>{`Tem certeza que deseja excluir o usuário ${usuarioToDelete.nome}?`}</span>
                </div>
              }
              open={showConfirmDelete}
              onClose={() => setShowConfirmDelete(false)}
              buttons={
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
                  <Button variant="destructive" onClick={confirmDeleteUser}>Deletar</Button>
                </div>
              }
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default UsuariosPage;
