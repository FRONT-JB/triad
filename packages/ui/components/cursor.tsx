import { cn } from "../lib/utils.js";
import { Children, type HTMLAttributes, type SVGProps } from "react";
import { Icon } from "./icon.js";

export type CursorProps = HTMLAttributes<HTMLSpanElement> & {
  userColor: string;
};
export const Cursor = ({
  className,
  children,
  userColor,
  ...props
}: CursorProps) => (
  <span
    className={cn(
      "tw-pointer-events-none tw-relative tw-select-none group",
      className
    )}
    style={{ "--user-color": userColor } as React.CSSProperties}
    {...props}
  >
    {children}
  </span>
);
export type CursorPointerProps = SVGProps<SVGSVGElement>;
export const CursorPointer = ({ className, ...props }: CursorPointerProps) => (
  <svg
    aria-hidden="true"
    className={cn("tw-size-3.5 tw-text-[var(--user-color)]", className)}
    fill="none"
    focusable="false"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"
      fill="currentColor"
    />
  </svg>
);
export type CursorCommentProps = HTMLAttributes<HTMLSpanElement>;
export const CursorComment = ({ className, ...props }: CursorCommentProps) => (
  <span
    className={cn(
      "tw-rounded-full tw-rounded-tl-[0] tw-ring-1 tw-ring-white tw-bg-blue-500 tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center",
      className
    )}
    {...props}
  >
    <Icon name="Plus" size="sm" className="tw-text-white" />
  </span>
);
export type CursorBodyProps = HTMLAttributes<HTMLSpanElement>;
export const CursorBody = ({
  children,
  className,
  ...props
}: CursorBodyProps) => (
  <span
    className={cn(
      "tw-relative tw-ml-3.5 tw-flex tw-flex-col tw-whitespace-nowrap tw-rounded-xl tw-py-1 tw-pr-3 tw-pl-2.5 tw-text-xs",
      Children.count(children) > 1 &&
        "tw-rounded-tl [&>:first-child]:tw-opacity-70",
      "tw-bg-[var(--user-color)] tw-text-white",
      className
    )}
    {...props}
  >
    {children}
  </span>
);
export type CursorNameProps = HTMLAttributes<HTMLSpanElement>;
export const CursorName = (props: CursorNameProps) => <span {...props} />;
export type CursorMessageProps = HTMLAttributes<HTMLSpanElement>;
export const CursorMessage = (props: CursorMessageProps) => <span {...props} />;
