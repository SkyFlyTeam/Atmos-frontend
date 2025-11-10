import { alertaService } from '@/services/alertaService';
import { ApiException } from '@/config/apiException';

// Mocks para os métodos do Api
const mockGet = jest.fn();
const mockDelete = jest.fn();

jest.mock('@/config/api', () => ({
  Api: {
    get: (...args: any[]) => mockGet(...args),
    delete: (...args: any[]) => mockDelete(...args),
  },
}));

describe('alertaService', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockDelete.mockReset();
  });

  it('deve retornar lista de alertas em caso de sucesso em getAllAlertas', async () => {
    const fakeData = [
      { pk: 1, data: '2025-11-10', valor_capturado_pk: 10, tipo_alerta_pk: 2 },
    ];
    mockGet.mockResolvedValue({ data: fakeData });

    const result = await alertaService.getAllAlertas();

    expect(Array.isArray(result)).toBe(true);
    expect((result as any)[0]).toMatchObject({ pk: 1 });
  });

  it('deve retornar ApiException quando getAllAlertas falhar com Error', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    const result = await alertaService.getAllAlertas();

    expect(result).toBeInstanceOf(ApiException);
    expect((result as ApiException).message).toContain('Network error');
  });

  it('deve retornar dados ao excluir alerta com sucesso', async () => {
    mockDelete.mockResolvedValue({ data: { success: true } });

    const result = await alertaService.deleteAlerta(5);

    expect(result).toEqual({ success: true });
    expect(mockDelete).toHaveBeenCalledWith('/alerta/5');
  });

  it('deve retornar ApiException com mensagem desconhecida quando delete lança valor não-Error', async () => {
    // lançar algo que não seja instanceof Error
    mockDelete.mockRejectedValue('boom');

    const result = await alertaService.deleteAlerta(7);

    expect(result).toBeInstanceOf(ApiException);
    expect((result as ApiException).message).toBe('Erro desconhecido.');
  });
});
