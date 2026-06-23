import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "icon" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const baseClassName =
  "font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#a8d5ba]";

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "border-0 bg-[#c8e6d2] text-[#2f302e] hover:bg-[#b7dfc8]",
  secondary: "border border-[#e4e4e0] bg-transparent text-[#62645f] hover:border-[#c8e6d2] hover:text-[#2f302e]",
  ghost:
    "border border-transparent bg-transparent text-[#62645f] hover:border-[#e4e4e0] hover:bg-[#f7f7f5]/80 hover:text-[#2f302e]",
};

const sizeClassNames: Record<ButtonSize, string> = {
  md: "min-h-11 min-w-28 rounded-2xl px-5 py-3 text-sm focus-visible:outline-offset-4",
  icon:
    "inline-grid h-11 w-11 place-items-center rounded-full p-0 focus-visible:outline-offset-3 [&_svg]:block",
  sm: "min-h-9 min-w-12 rounded-full px-3 py-1 text-xs focus-visible:outline-offset-3",
};

const Button = ({ children, className, size = "md", type = "button", variant = "secondary", ...props }: ButtonProps) => (
  <button
    className={[baseClassName, variantClassNames[variant], sizeClassNames[size], className]
      .filter(Boolean)
      .join(" ")}
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Button;
