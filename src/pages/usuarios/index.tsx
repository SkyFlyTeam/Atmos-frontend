import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import ButtonIconRight from "@/components/Buttons/ButtonIconRight";
import { FaPlus } from "react-icons/fa";
import UsuarioModal from "@/components/Modal/UsuarioModal";
import Modal from "@/components/Modal/Modal";
import { Usuario } from "@/interfaces/Usuarios";
import { usuarioServices, testApiConnection } from "@/services/usuarioServices";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable/Datatable";
import { columns } from "./columns";
import { toast } from 'react-toastify';
 

const UsuariosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
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
        toast.success("Usuário excluído com sucesso!");
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        setError('Erro ao deletar usuário. Verifique se o servidor backend está rodando.');
        setTimeout(() => setError(null), 5000);
        toast.error("Erro ao deletar usuário.");
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

  // A busca e paginação agora são controladas pelo DataTable.

  if (loading) {
    return (
            <div className="flex-1 pr-0 md:pr-8 w-full">
              <h1>Usuários</h1>
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
    );
  }

  return (
    <>
          {/* Área Principal - Lista de Usuários */}
          <div className="flex gap-3 flex-col">
            <h1>Usuários</h1>
            
            <Card className="flex flex-col gap-3 md:p-6 p-0 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none">
              {error && (
                <div className="w-full text-center text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
                  {error}
                  <div>
                    <button onClick={loadUsuarios} className="mt-2 px-4 py-2 bg-green text-white rounded-lg hover:bg-green/90 transition-colors">
                      Tentar novamente
                    </button>
                  </div>
                </div>
              )}
              <DataTable
                columns={columns}
                data={usuarios}
                meta={{
                  actions: { onEdit: handleEditUser, onDelete: handleDeleteUser },
                }}
                actionButton={
                  <ButtonIconRight
                    label="Novo Usuário"
                    onClick={handleCreateUser}
                    icon={<FaPlus className="!w-3 !h-3" />}
                  />
                }
              />
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
        </>
  );
};

export default UsuariosPage;
