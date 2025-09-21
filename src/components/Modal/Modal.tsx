import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'; 

type ModalProps = {
  open: boolean; // Controle externo do estado aberto/fechado
  onClose: () => void; // Função para fechar o Dialog
  title: string; // Título do Modal
  content?: ReactNode; // Conteúdo do Modal
  buttons?: ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, content, buttons }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='fixed top-text-base max-w-[calc(100%-2rem)] rounded-md w-fit max-h-[calc(100%-4rem)] h-fit [&>button]:cursor-pointer [&>button>svg]:w-7 [&>button>svg]:h-7 [&>button>svg]:hover:text-red'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{title}</DialogTitle>
        </DialogHeader>
          {content}
        <DialogFooter>
            {buttons}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
