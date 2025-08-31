import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "tw-inline-flex tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-md tw-text-[14px] tw-font-medium tw-transition-colors focus-visible:tw-outline-none disabled:tw-pointer-events-none disabled:tw-opacity-50",
  {
    variants: {
      variant: {
        default: "tw-bg-gray-900 tw-text-white tw-shadow hover:tw-bg-gray-800",
        destructive:
          "tw-bg-red-500 tw-text-white tw-shadow-sm hover:tw-bg-red-600",
        outline:
          "tw-border tw-border-gray-300 tw-bg-white tw-shadow-sm hover:tw-bg-gray-50",
        secondary:
          "tw-bg-gray-100 tw-text-gray-900 tw-shadow-sm hover:tw-bg-gray-200",
        ghost: "hover:tw-bg-gray-100 hover:tw-text-gray-900",
        link: "tw-text-blue-500 tw-underline-offset-4 hover:tw-underline",
      },
      size: {
        default: "tw-h-9 tw-px-4 tw-py-2",
        sm: "tw-h-7 tw-px-2 tw-text-xs",
        lg: "tw-h-10 tw-px-8",
        icon: "tw-h-9 tw-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type { ButtonProps };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
