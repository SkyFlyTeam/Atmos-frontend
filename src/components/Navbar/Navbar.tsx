import { HiOutlineUserCircle } from "react-icons/hi";
import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import Perfil from "@/components/Perfil/Perfil";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openProfile = () => {
    setIsOpen(true);
  };

  const closeProfile = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-full h-16 bg-white flex justify-between items-center px-4 relative">
      <div className="flex items-center space-x-4">
        {/* O ícone será fixo no canto superior direito */}
        <button
          onClick={openProfile}
          className="absolute top-4 right-4 text-3xl text-[#72BF01] hover:text-green-500"
        >
          <HiOutlineUserCircle />
        </button>
      </div>

      {/* Quando o botão for clicado, o Dialog com o componente Perfil será aberto */}
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <Perfil usuarioId={1} open={isOpen} onClose={closeProfile} />
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
};

export default Navbar;
