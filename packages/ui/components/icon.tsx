import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  MessageCircle,
  RotateCcw,
  Menu,
  Server,
  Loader,
  MonitorCog,
  MonitorOff,
  Plus,
  type LucideProps,
} from "lucide-react";
import { cn } from "../lib/utils.js";

const iconVariants = cva("tw-inline-block", {
  variants: {
    size: {
      xs: "tw-h-3 tw-w-3",
      sm: "tw-h-4 tw-w-4",
      default: "tw-h-5 tw-w-5",
      lg: "tw-h-6 tw-w-6",
      xl: "tw-h-8 tw-w-8",
      "2xl": "tw-h-10 tw-w-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

// 자주 사용하는 아이콘들만 매핑
const ICON_MAP = {
  MessageCircle,
  RotateCcw,
  Server,
  Menu,
  Loader,
  MonitorCog,
  MonitorOff,
  Plus,
} as const;

type IconName = keyof typeof ICON_MAP;

interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref">,
    VariantProps<typeof iconVariants> {
  name: IconName;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, className, size, ...props }, ref) => {
    const LucideIcon = ICON_MAP[name] as React.ComponentType<LucideProps>;

    if (!LucideIcon) {
      // 폴백 아이콘
      return (
        <Loader
          ref={ref}
          className={cn(iconVariants({ size }), className)}
          {...props}
        />
      );
    }

    return (
      <LucideIcon
        ref={ref}
        className={cn(iconVariants({ size }), className)}
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";

export { Icon, iconVariants };
export type { IconProps, IconName };
