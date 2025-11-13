import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import Navigation from './Navigation';
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAlertaWebSocket } from '@/hooks/useAlertaWebSocket';
import { toast } from 'react-toastify';

interface HeaderProps {
  activeItem?: string;
  showLogo?: boolean;
  showNavigation?: boolean;
  showLoginButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  activeItem,
  showLogo = true,
  showNavigation = true,
  showLoginButton = true
}) => {
  // WebSocket para receber alertas
  const { alertas, isConnected, clearAlertas } = useAlertaWebSocket({
    socketUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws/alerta',
    onNewAlerta: (alerta) => {
      // Gera mensagem a partir dos dados do alerta
      const tipoAlerta = alerta.tipo_alerta_pk;
      const valor = alerta.valor_capturado_pk;
      const parametro = alerta.tipo_alerta_pk;
      
      const mensagem =
        parametro && valor !== undefined ? (
          <span>
            {tipoAlerta}
            <br />
            {parametro}: {valor}
          </span>
        ) : (
          tipoAlerta
        );
      
      toast.info(mensagem, {
        position: 'top-right',
        autoClose: 4500,
        pauseOnHover: true,
        closeOnClick: true,
        hideProgressBar: false,
        draggable: true,
        icon: (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: '999px',
              background: 'rgba(30,129,76,0.12)',
              color: '#1E814C',
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            !
          </span>
        ),
        style: {
          background: 'rgba(255,255,255,0.95)',
          color: '#1E2A22',
          border: '1px solid rgba(30,129,76,0.18)',
          borderRadius: '14px',
          boxShadow: '0 10px 30px -15px rgba(30,129,76,0.45)',
          backdropFilter: 'blur(4px)',
          padding: '12px 14px',
          fontSize: '15px',
          lineHeight: '1.3',
          letterSpacing: '0.01em',
        },
        progressClassName: '!bg-[#1E814C] h-[3px] opacity-60 rounded-full',
      });
    },
    enabled: true
  });

  return (
    <header className="bg-white-pure shadow-sm border-b relative w-screen min-w-full" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
      {/* Logo - Canto Esquerdo */}
      {showLogo && (
        <div className="absolute left-6 top-6">
          <Logo />
        </div>
      )}

      {/* Menu - Centro Superior */}
      {showNavigation && (
        <div className="flex justify-center py-6">
          <Navigation activeItem={activeItem} />
        </div>
      )}

      {/* Avatar e Botão Sair - Canto Direito */}
      {showLoginButton && (
        <div className="absolute right-6 top-6 flex items-center space-x-3">
          {/* Ícone de Avatar */}
          <div className="w-10 h-10 bg-white-pure rounded-full flex items-center justify-center border-2 border-green">
            <User className="w-6 h-6 text-green" />
          </div>

          {/* Botão Sair */}
          <Link href="/logout">
            <Button
              className="bg-red text-white-pure hover:bg-red/90 px-4 py-2 font-londrina flex items-center space-x-2"
              style={{ borderRadius: '290px' }}
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;