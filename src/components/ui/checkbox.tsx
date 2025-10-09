import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

// Estilo do checkbox em formato de "radio":
// - Aro cinza (#ADADAD)
// - Hover: aro e preenchimento semi-transparente (#00312D com bg rgba(2,2,2,0.5))
// - Quando marcado, aro verde escuro (#00312D) com bolinha interna cinza (#CCCCCC) e borda #00312D
// - Fundo branco sempre
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // container circular com aro cinza
      "relative peer h-[14px] w-[14px] shrink-0 rounded-full border border-[#ADADAD] bg-white cursor-pointer",
      // foco e estados
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      // quando marcado troca a cor do aro
      "data-[state=checked]:border-[#00312D]",
      // pseudo-elemento para hover (simula ::after do CSS do radio)
      "after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:pointer-events-none after:w-0 after:h-0",
      "hover:after:w-[0.6rem] hover:after:h-[0.6rem] hover:after:border hover:after:border-[#00312D] hover:after:bg-[rgba(2,2,2,0.5)]",
      className
    )}
    {...props}
  >
    {/* bolinha interna quando marcado */}
    <CheckboxPrimitive.Indicator className={cn("relative z-10 flex items-center justify-center")}> 
      <span className="block h-[0.6rem] w-[0.6rem] rounded-full bg-[#CCCCCC] border border-[#00312D]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
