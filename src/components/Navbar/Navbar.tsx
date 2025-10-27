"use client";

import { CircleUserRound } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter, usePathname } from "next/navigation";
import Perfil from "@/components/Perfil/Perfil";
import { toast } from "react-toastify";
import { usuarioServices } from "@/services/usuarioServices";

// Helper para decodificar payload de JWT (base64url)
const decodeJwtPayload = (token: string): any | null => {
    try {
        const raw = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const payloadPart = raw.split('.')[1];
        if (!payloadPart) return null;
        let base = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
        while (base.length % 4 !== 0) base += '=';
        const json = JSON.parse(atob(base));
        return json;
    } catch (e) {
        console.error('Erro ao decodificar payload JWT:', e);
        return null;
    }
};

// Abas comentadas conforme solicitado
const abas = [
    // {nome: "Início", rota: "/", necessarioLogin: false},
    // {nome: "Guia Educativo", rota: "/guia-educativo", necessarioLogin: false},
    {nome: "Dashboard", rota: "/dashboard", necessarioLogin: true},
    {nome: "Estações", rota: "/estacoes", necessarioLogin: false},
    {nome: "Parâmetros", rota: "/parametros", necessarioLogin: false},
    {nome: "Alertas", rota: "/tipo-alerta", necessarioLogin: false}, // Corrigido para /tipo-alerta
    {nome: "Usuários", rota: "/usuarios", necessarioLogin: true},
]


const Navbar: React.FC = () => {
    const [estaLogado, setEstaLogado] = useState<boolean>(false);
    const [openPerfil, setOpenPerfil] = useState<boolean>(false);
    const [usuarioId, setUsuarioId] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Checa token no localStorage para manter login ao recarregar
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            setEstaLogado(!!token);
            // Ouve evento customizado para atualizar estado ao logar
            const onUsuarioLogado = () => setEstaLogado(true);
            window.addEventListener('usuarioLogado', onUsuarioLogado);
            return () => window.removeEventListener('usuarioLogado', onUsuarioLogado);
        }
    }, []);

    const abaSelecionada = abas.find((aba) => aba.rota === pathname || (pathname === '/' && aba.rota === '/estacoes'))?.nome || "";

    const handleTrocaDeAba = (aba: typeof abas[number]) => {
        if (pathname !== aba.rota) {
            router.push(aba.rota);
        }
    };

    // Função para login/logout
    const handleLoginLogout = () => {
        if (estaLogado) {
            // Logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setEstaLogado(false);
            router.push('/');
        } else {
            // Login
            router.push('/login');
        }
    };

    const handleOpenPerfil = async () => {
        if (!estaLogado) return;
        try {
            let id: number | null = null;
            if (typeof window !== 'undefined') {
                // 1) Tenta obter do localStorage.user
                const stored = localStorage.getItem('user');
                let storedEmail: string | null = null;
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        id = parsed?.pk ?? parsed?.id ?? null;
                        storedEmail = parsed?.email ?? null;
                    } catch (e) {
                        // Pode ser um valor antigo como "[object Object]"
                        console.warn('Aviso: user no localStorage não é JSON válido. Continuando com fallbacks...');
                    }
                }

                // 2) Se ainda não encontrou, tenta buscar por email na lista de usuários
                if (!id && storedEmail) {
                    try {
                        const all = await usuarioServices.getAllUsuarios();
                        const found = Array.isArray(all)
                          ? all.find((u: any) => (u?.email || '').toLowerCase() === storedEmail!.toLowerCase())
                          : null;
                        if (found?.pk || found?.id) {
                            id = found.pk ?? found.id;
                            // Salva usuário mínimo reparado
                            localStorage.setItem('user', JSON.stringify({ pk: id, email: found.email, nome: found.nome }));
                        }
                    } catch (err) {
                        console.error('Erro ao buscar usuários para identificar o ID:', err);
                    }
                }

                // 3) Fallback: decodifica o JWT (base64url) para extrair o id/pk
                if (!id) {
                    const token = localStorage.getItem('token') || '';
                    if (token) {
                        const payload = decodeJwtPayload(token);
                        if (payload) {
                            id = payload?.pk ?? payload?.id ?? payload?.sub ?? null;
                            if (id && !storedEmail) {
                                localStorage.setItem('user', JSON.stringify({ pk: id }));
                            }
                        }
                    }
                }

                if (id) {
                    setUsuarioId(Number(id));
                }
                // Abre o Perfil mesmo que o ID não tenha sido resolvido aqui; o componente resolve internamente
                setOpenPerfil(true);
            }
        } catch (e) {
            console.error('Erro ao abrir o perfil:', e);
            toast.error('Erro ao abrir o perfil.');
        }
    };

    return (
        <>
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Esquerda */}
                    <div className="flex-shrink-0 flex items-center">
                        <img
                            src=".\images\logo.png"
                            alt="Atmos Logo"  
                            className="h-8"
                        />
                    </div>

                    {/* Botões Centrais */}
                    <div
                        className="hidden md:block px-4 py-2 rounded-full text-sm font-medium transition-colors"
                        style={{ backgroundColor: "var(--color-dark-green)" }}
                    >
                        <div className="flex items-baseline space-x-4">
                            {abas
                                .filter(aba => !aba.necessarioLogin || estaLogado)
                                .map((aba, index) => (
                                    <button
                                        key={aba.nome}
                                        onClick={() => handleTrocaDeAba(aba)}
                                        style={{
                                        backgroundColor:
                                            aba.nome === abaSelecionada
                                            ? "var(--color-green)"
                                            : undefined,
                                        cursor: "pointer",
                                        }}
                                        className={` text-white px-4 py-2 rounded-full text-sm font-medium transition-colors`}
                                    >
                                        {aba.nome}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                    
                    {/* Botão Login/Logout - Direita */}
                    <div className="flex items-center gap-2">
                    {estaLogado && (
                        <CircleUserRound
                            onClick={handleOpenPerfil}
                            className="w-7 h-7 cursor-pointer"
                            style={{ color: 'var(--color-green)' }}
                        />
                    )}

                    <button
                        onClick={handleLoginLogout}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors hover:bg-green-700 text-white ${estaLogado ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        style={{
                            cursor: "pointer",
                            ...( !estaLogado ? { backgroundColor: 'var(--color-green)' } : {} )
                        }}
                    >
                        {estaLogado ? 'Sair' : 'Login'}
                    </button>

                    </div>


                    {/* Menu Mobile */}
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-gray-600 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        {openPerfil && (
            <Perfil usuarioId={usuarioId ?? undefined} open={openPerfil} onClose={() => setOpenPerfil(false)} />
        )}
        </>
    );
};

export default Navbar;