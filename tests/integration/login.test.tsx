import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import LoginPage from '@/pages/login/index';
import { loginServices } from '@/services/loginServices';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/services/loginServices', () => ({
  loginServices: {
    getAuth: jest.fn(),
    setLogin: jest.fn(),
  },
}));

describe('LoginPage Integration Tests', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('should render login form when user is not authenticated', async () => {
    // Return undefined to trigger needLogin = true
    (loginServices.getAuth as jest.Mock).mockResolvedValue(undefined);

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });
  });

  it('should redirect to home when user is already authenticated', async () => {
    (loginServices.getAuth as jest.Mock).mockResolvedValue(true);

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should handle successful login', async () => {
    (loginServices.getAuth as jest.Mock).mockResolvedValue(undefined);
    (loginServices.setLogin as jest.Mock).mockResolvedValue({
      email: 'test@example.com',
      token: 'mock-token',
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
      expect(loginServices.setLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        senha: 'password123',
      });
      expect(toast.success).toHaveBeenCalledWith('Login realizado com sucesso!');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should handle failed login and show error message', async () => {
    (loginServices.getAuth as jest.Mock).mockResolvedValue(undefined);
    (loginServices.setLogin as jest.Mock).mockResolvedValue({
      message: 'Credenciais inválidas',
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
      expect(mockPush).not.toHaveBeenCalledWith('/');
    });
  });

  it('should disable inputs and button while logging in', async () => {
    (loginServices.getAuth as jest.Mock).mockResolvedValue(undefined);
    (loginServices.setLogin as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ email: 'test@example.com', token: 'token' }), 100))
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
    (loginServices.getAuth as jest.Mock).mockResolvedValue(undefined);

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

    expect(emailInput.value).toBe('newemail@example.com');
  });

  it('should update senha input value on change', async () => {
    (loginServices.getAuth as jest.Mock).mockResolvedValue(undefined);

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    });

    const senhaInput = screen.getByPlaceholderText('Senha') as HTMLInputElement;

    fireEvent.change(senhaInput, { target: { value: 'newpassword' } });

    expect(senhaInput.value).toBe('newpassword');
  });
});