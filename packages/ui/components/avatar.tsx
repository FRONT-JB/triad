import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils.js";

const avatarVariants = cva(
  "tw-relative tw-flex tw-shrink-0 tw-overflow-hidden tw-rounded-full",
  {
    variants: {
      size: {
        sm: "tw-h-8 tw-w-8",
        default: "tw-h-10 tw-w-10",
        lg: "tw-h-12 tw-w-12",
        xl: "tw-h-16 tw-w-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const avatarImageVariants = cva("tw-aspect-square tw-h-full tw-w-full", {
  variants: {
    objectFit: {
      cover: "tw-object-cover",
      contain: "tw-object-contain",
      fill: "tw-object-fill",
    },
  },
  defaultVariants: {
    objectFit: "cover",
  },
});

const avatarFallbackVariants = cva(
  "tw-flex tw-h-full tw-w-full tw-items-center tw-justify-center tw-rounded-full tw-bg-muted tw-font-medium tw-text-muted-foreground",
  {
    variants: {
      size: {
        sm: "tw-text-xs",
        default: "tw-text-sm",
        lg: "tw-text-base",
        xl: "tw-text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof avatarImageVariants> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, objectFit, ...props }, ref) => (
    <img
      ref={ref}
      className={cn(avatarImageVariants({ objectFit }), className)}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarFallbackVariants> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarFallbackVariants({ size }), className)}
      {...props}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };

export type { AvatarProps, AvatarImageProps, AvatarFallbackProps };
