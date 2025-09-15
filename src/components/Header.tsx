import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import Navigation from './Navigation';
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

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