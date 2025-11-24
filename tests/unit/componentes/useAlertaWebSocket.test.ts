import { renderHook, waitFor, act } from '@testing-library/react';
import { useAlertaWebSocket } from '@/hooks/useAlertaWebSocket';
import { Alerta } from '@/interfaces/Alerta';
import { ReadyState } from 'react-use-websocket';

// Variáveis do mock (precisam estar fora do jest.mock para serem acessíveis)
const mockSendMessage = jest.fn();
let mockLastMessage: MessageEvent | null = null;
let mockReadyState = ReadyState.CONNECTING;
let mockOnOpen: (() => void) | null = null;
let mockOnClose: (() => void) | null = null;
let mockOnError: ((event: Event) => void) | null = null;

// Mock do react-use-websocket - a função precisa estar dentro do jest.mock
jest.mock('react-use-websocket', () => {
    // Cria a função mock diretamente aqui para evitar problemas de hoisting
    const mockFn = jest.fn((url: string | null, options?: any) => {
        if (options?.onOpen) mockOnOpen = options.onOpen;
        if (options?.onClose) mockOnClose = options.onClose;
        if (options?.onError) mockOnError = options.onError;

        return {
            sendMessage: mockSendMessage,
            get lastMessage() {
                return mockLastMessage;
            },
            get readyState() {
                return mockReadyState;
            },
        };
    });

    return {
        __esModule: true,
        default: mockFn,
        ReadyState: {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3,
            UNINSTANTIATED: -1,
        },
    };
});

describe('useAlertaWebSocket', () => {
    const mockAlerta: Alerta = {
        pk: 1,
        data_hora: '2024-01-15T10:30:00Z',
        tipo_alerta: {
            pk: 1,
            tipo: 'Temperatura Alta',
            descricao: 'Alerta quando temperatura excede o limite',
            publica: true,
            tipo_alarme: 2,
            p1: 30.0,
            p2: null,
        },
        captura_valor: {
            pk: 1,
            tipo_parametro: 'Temperatura',
            valor: 35.5,
            datetime: '2024-01-15T10:30:00Z',
            estacao_nome: 'Estação Central',
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockReadyState = ReadyState.CONNECTING;
        mockLastMessage = null;
        mockOnOpen = null;
        mockOnClose = null;
        mockOnError = null;
    });

    it('deve inicializar com estado vazio', () => {
        const { result } = renderHook(() => useAlertaWebSocket());

        expect(result.current.alertas).toEqual([]);
        expect(result.current.messageHistory).toEqual([]);
        expect(result.current.isConnected).toBe(false);
    });

    it('deve conectar quando enabled é true', () => {
        renderHook(() =>
            useAlertaWebSocket({
                socketUrl: 'ws://localhost:4000/ws/alerta',
                enabled: true,
            })
        );

        const useWebSocket = require('react-use-websocket').default;
        expect(useWebSocket).toHaveBeenCalledWith(
            'ws://localhost:4000/ws/alerta',
            expect.any(Object)
        );
    });

    it('não deve conectar quando enabled é false', () => {
        renderHook(() =>
            useAlertaWebSocket({
                socketUrl: 'ws://localhost:4000/ws/alerta',
                enabled: false,
            })
        );

        const useWebSocket = require('react-use-websocket').default;
        expect(useWebSocket).toHaveBeenCalledWith(
            null,
            expect.any(Object)
        );
    });

    it('deve processar nova mensagem e adicionar alerta', async () => {
        const mockOnNewAlerta = jest.fn();
        const { result, rerender } = renderHook(() =>
            useAlertaWebSocket({
                onNewAlerta: mockOnNewAlerta,
            })
        );

        // Simula recebimento de mensagem criando um novo objeto MessageEvent
        act(() => {
            mockLastMessage = new MessageEvent('message', {
                data: JSON.stringify(mockAlerta),
            });
        });

        // Força re-render para que o useEffect detecte a mudança
        rerender();

        await waitFor(() => {
            expect(result.current.alertas.length).toBeGreaterThan(0);
        });

        expect(mockOnNewAlerta).toHaveBeenCalledWith(
            expect.objectContaining({
                pk: mockAlerta.pk,
            })
        );
    });

    it('não deve adicionar alerta duplicado', async () => {
        const { result, rerender } = renderHook(() => useAlertaWebSocket());

        // Adiciona primeiro alerta
        act(() => {
            mockLastMessage = new MessageEvent('message', {
                data: JSON.stringify(mockAlerta),
            });
        });
        rerender();

        await waitFor(() => {
            expect(result.current.alertas.length).toBe(1);
        });

        // Tenta adicionar o mesmo alerta novamente (mesmo pk)
        act(() => {
            mockLastMessage = new MessageEvent('message', {
                data: JSON.stringify(mockAlerta),
            });
        });
        rerender();

        await waitFor(() => {
            // Deve manter apenas 1 alerta (sem duplicatas)
            expect(result.current.alertas.length).toBe(1);
        });
    });

    it('deve retornar status de conexão correto', () => {
        mockReadyState = ReadyState.OPEN;
        const { result } = renderHook(() => useAlertaWebSocket());

        expect(result.current.isConnected).toBe(true);
        expect(result.current.connectionStatus).toBe('Conectado');
    });

    it('deve retornar status desconectado quando readyState é CLOSED', () => {
        mockReadyState = ReadyState.CLOSED;
        const { result } = renderHook(() => useAlertaWebSocket());

        expect(result.current.isConnected).toBe(false);
        expect(result.current.connectionStatus).toBe('Desconectado');
    });

    it('deve limpar alertas quando clearAlertas é chamado', async () => {
        const { result, rerender } = renderHook(() => useAlertaWebSocket());

        // Adiciona alerta
        act(() => {
            mockLastMessage = new MessageEvent('message', {
                data: JSON.stringify(mockAlerta),
            });
        });
        rerender();

        await waitFor(() => {
            expect(result.current.alertas.length).toBe(1);
        });

        // Limpa alertas
        act(() => {
            result.current.clearAlertas();
        });

        expect(result.current.alertas).toEqual([]);
        expect(result.current.messageHistory).toEqual([]);
    });

    it('deve enviar mensagem quando sendMessage é chamado', () => {
        const { result } = renderHook(() => useAlertaWebSocket());

        act(() => {
            result.current.sendMessage('teste');
        });

        expect(mockSendMessage).toHaveBeenCalledWith('teste');
    });

    it('deve lidar com erro ao processar mensagem inválida', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const { result, rerender } = renderHook(() => useAlertaWebSocket());

        // Simula mensagem inválida (não é JSON)
        act(() => {
            mockLastMessage = new MessageEvent('message', {
                data: 'mensagem inválida',
            });
        });
        rerender();

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        }, { timeout: 3000 });

        expect(result.current.alertas).toEqual([]);
        consoleErrorSpy.mockRestore();
    });

    it('deve usar URL padrão quando não fornecida', () => {
        renderHook(() => useAlertaWebSocket());

        const useWebSocket = require('react-use-websocket').default;
        expect(useWebSocket).toHaveBeenCalledWith(
            'ws://localhost:4000/ws/alerta',
            expect.any(Object)
        );
    });
});

