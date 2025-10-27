const mesEndDates = [
    //0,      // Buffer
    31,     // Janeiro
    29,     // Fevereiro
    31,     // Março
    30,     // Abril
    31,     // Maio
    30,     // Junho
    31,     // Julho
    31,     // Agosto
    30,     // Setembro
    31,     // Outubro
    30,     // Novembro
    31      // Dezembro
]

const mesNomes = [
    //"N/A",
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]


export const getMesNomesList = (): string[] =>{
    return mesNomes;
}


export const getMesNome = (index: number): string => {
    if (!index)
        return "N/A";

    return mesNomes[(index - 1) % mesNomes.length];

}


const leapYear = (ano: number) => {
    if (ano % 4 != 0)
        return 0;

    if (ano % 100 == 0)
        if (ano % 400 != 0)
            return 0;

    return 1;
}
export const getMesEndDate = (index: number, ano?: number): number => {
    if (!index)
        return -1;

    if (index == 1)
        if(ano)
            return mesEndDates[index + leapYear(ano) - 1];
    
    return mesEndDates[index - 1];
}

