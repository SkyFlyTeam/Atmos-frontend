import React from 'react';
import { Button } from '@/components/ui/button'; // Importe o Button do seu projeto
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  table: any; 
};

const DatatablePagination: React.FC<PaginationProps> = ({ table }) => {
  return (
    <div className="flex items-center p-2 w-fit rounded-[18px] space-x-2 bg-white shadow-[0px_4px_35px_0px_rgba(0,_0,_0,_0.12)]">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className='text-dark-green'
      >
        <ChevronLeft className='w-5! h-5!' strokeWidth={3}/>
      </Button>
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {table.getPageCount() > 1 &&
            Array.from({ length: table.getPageCount() }, (_, index) => {
            const isCurrentIndex = table.getState().pagination.pageIndex === index;
            return(
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => table.setPageIndex(index)}
                className={`text-base rounded-3xl ${isCurrentIndex && 'bg-green text-white'}`}
              >
                {index + 1}
              </Button>
            )})}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className='text-dark-green hover:bg-dark-green hover:text-white'
      >
        <ChevronRight className='w-5! h-5!' strokeWidth={3}/>
      </Button>
    </div>
  );
};

export default DatatablePagination;
