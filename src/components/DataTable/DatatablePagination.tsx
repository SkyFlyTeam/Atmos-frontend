import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  table: any;
};

const DatatablePagination: React.FC<PaginationProps> = ({ table }) => {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  
  const pagesToShow = 4; 
  const range = Math.min(pagesToShow, pageCount);

  const getPageNumbers = () => {
    const pageNumbers: (string | number)[] = []; 
    const start = Math.max(0, currentPage - Math.floor(pagesToShow / 2));
    const end = Math.min(pageCount - 1, start + pagesToShow - 1);

    if (start > 0) {
      pageNumbers.push(0); 
      if (start > 1) pageNumbers.push('...'); 
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < pageCount - 1) {
      if (end < pageCount - 2) pageNumbers.push('...'); 
      pageNumbers.push(pageCount - 1); 
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center p-2 w-full md:w-fit justify-center rounded-[18px] space-x-2 bg-white shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)]">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="text-dark-green"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={3} />
      </Button>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {getPageNumbers().map((page, index) => {
            const isCurrentIndex = currentPage === (typeof page === 'number' ? page : -1);
            return page === '...' ? (
              <span key={index} className="text-base">...</span>
            ) : (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => table.setPageIndex(page as number)} 
                className={`text-base rounded-3xl ${isCurrentIndex && 'bg-green text-white'}`}
              >
                {(page as number) + 1}
              </Button>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="text-dark-green hover:bg-dark-green hover:text-white"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={3} />
      </Button>
    </div>
  );
};

export default DatatablePagination;
