import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600/20",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/20",
        outline:
          "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 focus-visible:ring-emerald-600/20",
        secondary:
          "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 focus-visible:ring-emerald-600/20",
        ghost:
          "text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 focus-visible:ring-emerald-600/20",
        link: "text-emerald-600 underline-offset-4 hover:underline focus-visible:ring-emerald-600/20",
        // New clean professional variants
        primary:
          "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 focus-visible:ring-emerald-600/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-emerald-500/30",
        clean:
          "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 focus-visible:ring-emerald-600/20 rounded-lg",
        minimal:
          "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 focus-visible:ring-emerald-600/20 rounded-lg",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4 text-base",
        xl: "h-14 rounded-lg px-8 has-[>svg]:px-6 text-base font-semibold",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isPending?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  isPending,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isPending}
      {...props}
    >
      {isPending ? (
        <div className="flex items-center relative">
          <Loader2 className={cn("h-5 w-5 mr-2 animate-spin")} />
          <Slottable>{children}</Slottable>
        </div>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
