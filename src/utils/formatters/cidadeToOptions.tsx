/**
 * Converte uma Array de Cidades no formato utilizado em selects/combobox -> {label: , value: }
 * @param cidades - Lista de cidades.
 * @returns Lista de options de cidades.
 */
export const formatCidadeToOptions = (cidades: string[]) => {
    return cidades.map((cidade) => ({
        label: cidade,
        value: cidade
    }))
}