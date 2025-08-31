import { useMode } from "@triad/shared";
import { useCursor } from "../useCursor";
import { lazy, Suspense } from "react";

const DefaultCursor = lazy(() => import("./default-cursor"));
const CommentCursor = lazy(() => import("./comment-cursor"));

interface CustomCursorProps {
  userName?: string;
  userColor?: string;
}

export function CustomCursor({
  userName = "You",
  userColor = "#3b82f6",
}: CustomCursorProps) {
  const { cursorRef, posX, posY, isVisible } = useCursor();
  const { mode } = useMode();

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="tw-fixed tw-pointer-events-none tw-z-cursor tw-transition-none"
      style={{
        left: posX,
        top: posY,
        transform: "translate(-2px, -2px)",
        willChange: "transform",
      }}
    >
      <Suspense fallback={null}>
        {(() => {
          switch (true) {
            case mode === "cursor":
              return (
                <DefaultCursor userName={userName} userColor={userColor} />
              );
            case mode === "comment":
              return (
                <CommentCursor userName={userName} userColor={userColor} />
              );
            default:
              return null;
          }
        })()}
      </Suspense>
    </div>
  );
}
