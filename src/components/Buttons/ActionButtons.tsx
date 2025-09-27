import React from 'react';
import { Button } from '@/components/ui/button';
import { BiSolidEditAlt } from 'react-icons/bi';
import { IoMdTrash } from 'react-icons/io';

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onEdit, 
  onDelete, 
  disabled = false 
}) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title="Editar usuário"
      >
        <BiSolidEditAlt className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={disabled}
        className="h-8 w-8 p-0"
        title="Deletar usuário"
      >
        <IoMdTrash className="w-5 h-5 text-red" />
      </Button>
    </div>
  );
};

export default ActionButtons;