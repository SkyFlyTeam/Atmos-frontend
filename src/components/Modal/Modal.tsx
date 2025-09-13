import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'; // Ajuste os imports conforme a estrutura do seu projeto

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
      <DialogContent className='text-base'>
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
