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
    const maxVisible = 7; // Máximo de páginas visíveis
    
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
    <div className={`flex justify-end items-center space-x-2 ${className}`}>
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
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="text-gray-dark font-londrina px-2">...</span>
          ) : (
            <Button
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={
                currentPage === page
                  ? "bg-green text-white-pure w-8 h-8 !rounded-full p-0 font-londrina hover:!bg-transparent hover:!text-dark-cyan hover:!rounded-none hover:!font-normal"
                  : "bg-transparent text-dark-cyan !rounded-none hover:!bg-transparent hover:!text-dark-cyan focus:!bg-transparent active:!bg-transparent !font-normal font-londrina"
              }
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

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
