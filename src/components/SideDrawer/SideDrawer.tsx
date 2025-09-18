import { ReactNode } from "react"
import { CgClose } from "react-icons/cg";

type SideDrawerProps = {
    onClose: () => void,
    title: string,
    content: ReactNode
}

const SideDrawer = ({onClose, title, content}: SideDrawerProps) => {
    return (
        <>
            <div className="fixed bottom-0 left-0 w-full h-full bg-gray-700/50"></div>
            <div className="fixed bottom-0 right-0 w-fit h-full bg-white-pure p-3 flex flex-col">
                <div className="w-full">
                    <CgClose className="w-7 h-7 text-gray-400 cursor-pointer hover:text-red" onClick={onClose}/>
                </div>
                <div className="px-6">
                    <h1>{title}</h1>
                    <div className="mt-4">
                        {content}
                    </div>
                </div>
            </div>
        </>
  );
}

export default SideDrawer;