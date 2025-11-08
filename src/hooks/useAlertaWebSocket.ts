import { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Alerta } from '@/interfaces/Alerta';

interface UseAlertaWebSocketOptions {
    socketUrl?: string;
    onNewAlerta?: (alerta: Alerta) => void;
    enabled?: boolean;
}

export const useAlertaWebSocket = ({
    socketUrl = 'ws://localhost:4000/ws/alerta',
    onNewAlerta,
    enabled = true
}: UseAlertaWebSocketOptions = {}) => {
    const [alertas, setAlertas] = useState<Alerta[]>([]);
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
    const onNewAlertaRef = useRef(onNewAlerta);

    // Atualiza a referência do callback quando ele mudar
    useEffect(() => {
        onNewAlertaRef.current = onNewAlerta;
    }, [onNewAlerta]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        enabled ? socketUrl : null,
        {
            onOpen: () => {
                console.log('🔌 WebSocket conectado para alertas');
            },
            onClose: () => {
                console.log('🔌 WebSocket desconectado');
            },
            onError: (event) => {
                console.error('❌ Erro no WebSocket:', event);
            },
            shouldReconnect: (closeEvent) => {
                // Reconecta automaticamente se não foi um fechamento intencional
                return true;
            },
            reconnectInterval: 3000, // Reconecta a cada 3 segundos
        }
    );

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                
                // Adiciona à lista de alertas
                const novoAlerta: Alerta = data;
                setAlertas((prev) => {
                    if (prev.some(a => a.pk === novoAlerta.pk)) {
                        return prev;
                    }
                    return [novoAlerta, ...prev];
                });

                // Adiciona ao histórico de mensagens
                setMessageHistory((prev) => prev.concat(lastMessage));

                // Chama o callback se fornecido
                if (onNewAlertaRef.current) {
                    onNewAlertaRef.current(novoAlerta);
                }
            } catch (error) {
                console.error('❌ Erro ao processar mensagem do WebSocket:', error);
            }
        }
    }, [lastMessage]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Conectando',
        [ReadyState.OPEN]: 'Conectado',
        [ReadyState.CLOSING]: 'Fechando',
        [ReadyState.CLOSED]: 'Desconectado',
        [ReadyState.UNINSTANTIATED]: 'Não iniciado',
    }[readyState];

    const sendAlertaMessage = useCallback(
        (message: string) => sendMessage(message),
        [sendMessage]
    );

    const clearAlertas = useCallback(() => {
        setAlertas([]);
        setMessageHistory([]);
    }, []);

    return {
        alertas,
        messageHistory,
        sendMessage: sendAlertaMessage,
        readyState,
        connectionStatus,
        isConnected: readyState === ReadyState.OPEN,
        clearAlertas,
    };
};

