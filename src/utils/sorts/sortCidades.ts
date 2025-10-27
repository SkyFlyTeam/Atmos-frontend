import { Cidade } from "@/interfaces/Cidade";

export function sortCidadesByUFAndNome(cidades: Cidade[]): Cidade[] {
    // 1. Agrupar as cidades por estado (uf)
    const cidadesPorEstado = cidades.reduce((acc, cidade) => {
        if (!acc[cidade.uf]) {
            acc[cidade.uf] = [];
        }
        acc[cidade.uf].push(cidade);
        return acc;
    }, {} as Record<string, Cidade[]>);

    // 2. Ordenar os estados (ufs) em ordem alfabética
    const ufsOrdenadas = Object.keys(cidadesPorEstado).sort();

    // 3. Criar a lista final, agrupando as cidades ordenadas
    const cidadesOrganizadas: Cidade[] = [];

    ufsOrdenadas.forEach(uf => {
        // 4. Ordenar as cidades dentro de cada estado por nome
        const cidadesDoEstado = cidadesPorEstado[uf].sort((a, b) => a.nome.localeCompare(b.nome));
        // Adicionar as cidades ordenadas ao array final
        cidadesOrganizadas.push(...cidadesDoEstado);
    });

    return cidadesOrganizadas;
}