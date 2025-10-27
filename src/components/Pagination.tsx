import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}) => {
  // Gerar array de páginas para exibir
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 4; // Máximo de páginas visíveis
    
    if (totalPages <= maxVisible) {
      // Se total de páginas é menor que o máximo, mostra todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com ellipsis
      if (currentPage <= 4) {
        // Mostra primeiras páginas
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Mostra últimas páginas
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Mostra páginas do meio
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={` ${className} flex items-center p-2 w-full md:w-fit justify-center rounded-[18px] space-x-2 bg-white shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)]`}>
      {/* Botão Anterior */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-dark font-londrina hover:bg-gray/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Números das páginas */}
      <div className="flex items-center space-x-2">
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="text-gray-dark font-londrina">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? 'bg-green text-white !rounded-full w-8 h-8 p-0 shadow-none'
                  : 'bg-transparent text-dark-cyan rounded-full w-8 h-8 p-0 shadow-none border-0 hover:bg-transparent hover:text-dark-cyan hover:font-normal focus:bg-transparent focus-visible:ring-0 active:bg-transparent'
              }
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}
      </div>

      {/* Botão Próximo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-dark font-londrina hover:bg-gray/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
