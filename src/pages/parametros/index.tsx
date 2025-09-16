import { DataTable } from "@/components/DataTable/Datatable"
import { Card } from "@/components/ui/card"
import { columns } from "./columns"

import { ParametrosData } from "./mockedData"
import { useState } from "react"
import { Parametro } from "@/interfaces/Parametros"
import { Button } from "@/components/ui/button"
import ButtonIconRight from "@/components/Buttons/ButtonIconRight"
import { FaPlus } from "react-icons/fa"
import Modal from "@/components/Modal/Modal"
import { toast } from "react-toastify"
import { parametroServices } from "@/services/parametroServices"

const ParametrosPage = () => {
    const [parametros, setParametros] = useState<Parametro[]>([]);
    const [paramSelecionado, setParamSelecionado] = useState<Parametro | null>(null);

    // Modal and side drawer controll
    const [showEditParam, setShowEditParam] = useState<boolean>(false);
    const [showConfirmDelete, setShowConfimDelete] = useState<boolean>(false);

    const onEdit = (row: Parametro) => {
        setParamSelecionado(row);
        setShowEditParam(true);
    };

    const onDelete = async (row: Parametro) => {
        setParamSelecionado(row);
        setShowConfimDelete(true);
    };

    const onAddParameter = () => {
        return 
    }

    const handleDeleteParam = () => {
        if (!paramSelecionado) { return }
        try {
            parametroServices.deleteParametro(paramSelecionado.pk);
            console.log("Paramêtro deletado com sucesso!")
        } catch {
            toast.error("Erro ao deletar toast.")
        }
        toast.error("Paramêtro deletado!");
        setShowConfimDelete(false);
        return
    }

    return (
        <>
            <div className="flex gap-3 flex-col">
                <h1>Paramêtros</h1>

                <Card className="flex flex-col gap-3 p-6 md:shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)] md:bg-white bg-white-bg shadow-none">
                    <DataTable 
                        columns={columns} 
                        data={ParametrosData}
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
        </>
    )
}

export default ParametrosPage;