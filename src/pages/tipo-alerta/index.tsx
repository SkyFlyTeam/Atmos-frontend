import { useEffect, useState } from "react"

import { columns } from "./columns"
import { TipoAlerta } from "@/interfaces/TipoAlerta"

import { Button } from "@/components/ui/button"
import ButtonIconRight from "@/components/Buttons/ButtonIconRight"
import Modal from "@/components/Modal/Modal"
import { toast } from "react-toastify"
import { tipoAlertaServices } from "@/services/tipoAlertaService"
import SideDrawer from "@/components/SideDrawer/SideDrawer"
import FormTipoAlerta from "./components/FormTipoAlerta"
import { DataTable } from "@/components/DataTable/Datatable"
import { Card } from "@/components/ui/card"
import SkeletonTable from "@/components/DataTable/DatatableSkeleton"

import { FaPlus } from "react-icons/fa"

const TipoAlertasPage = () => {
    const [tipoAlertas, setTipoAlertas] = useState<TipoAlerta[]>([]);
    const [tipoAlertaSelecionado, setTipoAlertaSelecionado] = useState<TipoAlerta | null>(null);

    // Modal and side drawer controll
    const [showSideDrawer, setShowSideDrawer] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfimDelete] = useState<boolean>(false);

    // Loading
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchAllTipoAlertas = async () => {
        try{
            const tipoAlertass = await tipoAlertaServices.getAllTipoAlertas();
            setTipoAlertas(tipoAlertass as TipoAlerta[]);
        } catch {
            console.log("Erro ao buscar tipos de alerta");
            toast.error("Erro ao buscar tipos de alerta");
            setTipoAlertas([]);
        } finally{
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchAllTipoAlertas();
    }, [])

    const onEdit = (row: TipoAlerta) => {
        setTipoAlertaSelecionado(row);
        setShowSideDrawer(true);
    };

    const onDelete = async (row: TipoAlerta) => {
        setTipoAlertaSelecionado(row);
        setShowConfimDelete(true);
        fetchAllTipoAlertas();
    };

    const onAddParameter = () => {
        setShowSideDrawer(true);
    }

    const handleDeleteParam = async () => {
        if (!tipoAlertaSelecionado || !tipoAlertaSelecionado.pk) { 
            toast.error("Erro: Tipo de alerta não encontrado.");
            return;
        }
        try {
            await tipoAlertaServices.deleteTipoAlerta(tipoAlertaSelecionado.pk);
            console.log("tipo de alerta deletado com sucesso!")
            toast.success("tipo de alerta deletado!");
            
            // Atualizar a lista imediatamente removendo o item deletado
            setTipoAlertas(prevTipoAlertas => 
                prevTipoAlertas.filter(item => item.pk !== tipoAlertaSelecionado.pk)
            );
        } catch {
            toast.error("Erro ao deletar tipo de alerta.")
        }
        setShowConfimDelete(false);
        closeSideDrawer(true);
    }

    const closeSideDrawer = (success: boolean = false) => {
        if (success) { fetchAllTipoAlertas(); }
        setShowSideDrawer(false);
        setTipoAlertaSelecionado(null);
    }

    return (
        <>
            <div className="flex gap-3 flex-col">
                <h1>Tipo de Alerta</h1>
                
                <Card className="flex flex-col gap-3 md:p-6 p-0 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none">
                    {isLoading ? (
                        <SkeletonTable />
                    ) : (
                        <DataTable 
                            columns={columns} 
                            data={tipoAlertas}
                            meta={{
                                actions: { onEdit, onDelete },
                            }}
                            actionButton={
                                <ButtonIconRight 
                                    label="Novo Tipo de Alerta"
                                    onClick={onAddParameter} 
                                    icon={<FaPlus className="!w-3 !h-3" />} 
                                />
                            }
                        />
                    )}
                </Card>
            </div>
            
            {showConfirmDelete && tipoAlertaSelecionado && (
                <Modal 
                    title="Atenção!"
                    content={
                        <div>
                            <span>{`Tem certeza que deseja excluir o tipo de alerta ${tipoAlertaSelecionado?.tipo}?`}</span>
                        </div>
                    }
                    open={showConfirmDelete}
                    onClose={() => closeSideDrawer()}
                    buttons={
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={() => setShowConfimDelete(false)}>Cancelar</Button>
                            <Button variant="destructive" onClick={() => handleDeleteParam()}>Deletar</Button>
                        </div>
                    }
                />
            )}

            {showSideDrawer && 
                <SideDrawer 
                    onClose={() => closeSideDrawer()}
                    title={tipoAlertaSelecionado ? "Editar tipo de alerta" : "Criar tipo de alerta"}
                    content={<FormTipoAlerta 
                        onClose={(success) => closeSideDrawer(success)} 
                        paramData={tipoAlertaSelecionado ? tipoAlertaSelecionado : undefined}
                        onDelete={tipoAlertaSelecionado ? () => {
<<<<<<< HEAD
                            setShowConfimDelete(true);
=======
                            closeSideDrawer(true);
>>>>>>> 313c01e (AT-25 fix: ajustado o onclose dos modais/sidebar)
                        } : undefined}
                    />}
                />
            }
        </>
    )
}

export default TipoAlertasPage;