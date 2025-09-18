import { useEffect, useState } from "react"

import { columns } from "./columns"
import { Parametro } from "@/interfaces/Parametros"

import { Button } from "@/components/ui/button"
import ButtonIconRight from "@/components/Buttons/ButtonIconRight"
import Modal from "@/components/Modal/Modal"
import { toast } from "react-toastify"
import { parametroServices } from "@/services/parametroServices"
import SideDrawer from "@/components/SideDrawer/SideDrawer"
import FormParametro from "./components/FormParametro"
import { DataTable } from "@/components/DataTable/Datatable"
import { Card } from "@/components/ui/card"

import { FaPlus } from "react-icons/fa"

const ParametrosPage = () => {
    const [parametros, setParametros] = useState<Parametro[]>([]);
    const [paramSelecionado, setParamSelecionado] = useState<Parametro | null>(null);

    // Modal and side drawer controll
    const [showSideDrawer, setShowSideDrawer] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfimDelete] = useState<boolean>(false);

    // Loading
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchAllParametros = async () => {
        try{
            const parametros = await parametroServices.getAllParametros();
            setParametros(parametros as Parametro[]);
        } catch {
            console.log("Erro ao buscar parametros");
            toast.error("Erro ao buscar paramêtros");
            setParametros([]);
        } finally{
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchAllParametros();
    }, [])

    const onEdit = (row: Parametro) => {
        setParamSelecionado(row);
        setShowSideDrawer(true);
    };

    const onDelete = async (row: Parametro) => {
        setParamSelecionado(row);
        setShowConfimDelete(true);
        fetchAllParametros();
    };

    const onAddParameter = () => {
        setShowSideDrawer(true);
    }

    const handleDeleteParam = () => {
        if (!paramSelecionado) { return }
        try {
            parametroServices.deleteParametro(paramSelecionado.pk);
            console.log("Paramêtro deletado com sucesso!")
            toast.success("Paramêtro deletado!");
            fetchAllParametros();
        } catch {
            toast.error("Erro ao deletar paramêtro.")
        }
        setShowConfimDelete(false);
    }

    const closeSideDrawer = (success: boolean = false) => {
        if (success) { fetchAllParametros(); }
        setShowSideDrawer(false);
        setParamSelecionado(null);
    }

    return (
        <>
            <div className="flex gap-3 flex-col">
                <h1>Paramêtros</h1>
                
                {isLoading ? (
                    <span>Carregando</span>
                ) : (
                    <Card className="flex flex-col gap-3 md:p-6 p-0 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none">
                        <DataTable 
                            columns={columns} 
                            data={parametros}
                            meta={{
                                actions: { onEdit, onDelete },
                            }}
                            actionButton={
                                <ButtonIconRight 
                                    label="Novo Paramêtro"
                                    onClick={onAddParameter} 
                                    icon={<FaPlus className="!w-3 !h-3" />} 
                                />
                            }
                        />
                    </Card>
                )}
            </div>
            
            {showConfirmDelete && paramSelecionado && (
                <Modal 
                    title="Atenção!"
                    content={
                        <div>
                            <span>{`Tem certeza que deseja apagar o paramêtro ${paramSelecionado?.nome}?`}</span>
                        </div>
                    }
                    open={showConfirmDelete}
                    onClose={() => setShowConfimDelete(false)}
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
                    title="Cadastrar Paramêtro"
                    content={<FormParametro onClose={(success) => closeSideDrawer(success)} paramData={paramSelecionado ? paramSelecionado : undefined}/>}
                />
            }
        </>
    )
}

export default ParametrosPage;