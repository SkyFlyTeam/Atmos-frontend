import { ReactNode } from "react";
import { CgClose } from "react-icons/cg";
import { Sheet, SheetContent } from "../ui/sheet";

type SideDrawerProps = {
  onClose: () => void;
  title: string;
  content: ReactNode;
};

const SideDrawer = ({ onClose, title, content }: SideDrawerProps) => {
  return (
    <>
    <Sheet open={true} onOpenChange={onClose} >
      <SheetContent side="right" className="w-full sm:max-w-xl p-9 overflow-y-auto bg-white">
        <div className="px-6">
          <h1>{title}</h1>
          <div className="mt-4">{content}</div>
        </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default SideDrawer;
