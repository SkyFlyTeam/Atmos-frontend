import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import LoginPage from '@/pages/login/index';
import { Api } from '@/config/api';

describe('LoginPage Integration Tests', () => {
  let router: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    localStorage.clear();

    router = useRouter();

    jest.spyOn(toast, 'success').mockImplementation(() => {});
    jest.spyOn(toast, 'error').mockImplementation(() => {});
  });

  it('should render login form when user is not authenticated', async () => {
    jest.spyOn(Api, 'get').mockRejectedValue(new Error('not authenticated'));

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });
  });

  it('should redirect to home when user is already authenticated', async () => {
    jest.spyOn(Api, 'get').mockResolvedValue({ data: { email: 'auth@example.com' } });

    render(<LoginPage />);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });

  it('should handle successful login', async () => {
    jest.spyOn(Api, 'get').mockRejectedValue(new Error('not authenticated'));
    jest.spyOn(Api, 'post').mockResolvedValue({
      data: { email: 'test@example.com', token: 'mock-token' },
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText('Email');
    const senhaInput = screen.getByPlaceholderText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(senhaInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Api.post).toHaveBeenCalledWith('/usuario/login', {
        email: 'test@example.com',
        senha: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
      expect(router.push).toHaveBeenCalledWith('/');
    });
  });

  it('should handle failed login and show error message', async () => {
    jest.spyOn(Api, 'get').mockRejectedValue(new Error('not authenticated'));
    jest.spyOn(Api, 'post').mockResolvedValue({
      data: { message: 'Credenciais inválidas' },
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText('Email');
    const senhaInput = screen.getByPlaceholderText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(senhaInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciais inválidas');
      expect(router.push).not.toHaveBeenCalledWith('/');
    });
  });

  it('should disable inputs and button while logging in', async () => {
    jest.spyOn(Api, 'get').mockRejectedValue(new Error('not authenticated'));
    jest.spyOn(Api, 'post').mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({ data: { email: 'test@example.com', token: 'token' } }), 100)
      )
    );

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const senhaInput = screen.getByPlaceholderText('Senha') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /entrar/i }) as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(senhaInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(emailInput.disabled).toBe(true);
    expect(senhaInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });

  it('should update email input value on change', async () => {
    jest.spyOn(Api, 'get').mockRejectedValue(new Error('not authenticated'));

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    expect(emailInput.value).toBe('newemail@example.com');
  });

  it('should update senha input value on change', async () => {
    jest.spyOn(Api, 'get').mockRejectedValue(new Error('not authenticated'));

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    });

    const senhaInput = screen.getByPlaceholderText('Senha') as HTMLInputElement;

    fireEvent.change(senhaInput, { target: { value: 'newpassword' } });

    expect(senhaInput.value).toBe('newpassword');
  });
});