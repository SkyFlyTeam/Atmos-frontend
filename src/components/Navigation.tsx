import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface NavigationProps {
  items?: NavItem[];
  activeItem?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Início", href: "/", isActive: false },
  { label: "Guia Educativo", href: "/guia", isActive: false },
  { label: "Dashboard", href: "/dashboard", isActive: false },
  { label: "Estações", href: "/estacoes", isActive: false },
  { label: "Parâmetros", href: "/parametros", isActive: false },
  { label: "Alertas", href: "/tipo-alerta", isActive: false },
  { label: "Usuários", href: "/usuarios", isActive: false },
];

const Navigation: React.FC<NavigationProps> = ({
  items = defaultNavItems,
  activeItem
}) => {
  return (
    <nav className="flex space-x-1 bg-dark-green px-4 py-2" style={{ borderRadius: '290px' }}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={
              item.isActive || activeItem === item.href
                ? "bg-light-green text-dark-green hover:bg-green px-4 py-2 rounded-full font-londrina border-2 border-light-green"
                : "text-white-pure hover:bg-green px-4 py-2 rounded-full font-londrina"
            }
          >
            {item.label}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;