import React, { ReactNode } from 'react';

type SidePanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const SidePanel: React.FC<SidePanelProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <>
      {/* Overlay sutil para deixar a tela principal opaca */}
      <div 
        className="fixed inset-0 z-40" 
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
        onClick={onClose}
      />
      
      {/* Painel lateral direito */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header com botão X acima e título abaixo (layout anterior) */}
        <div className="p-6 flex-shrink-0">
          <div className="flex justify-start mb-2">
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="text-gray-500 text-2xl font-bold w-8 h-8 flex items-center justify-start rounded-full hover:cursor-pointer hover:text-red"
            >
              ×
            </button>
          </div>
          <h1 className="text-4xl font-bold text-dark-green">{title}</h1>
        </div>
        
        {/* Conteúdo do painel com scroll */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
