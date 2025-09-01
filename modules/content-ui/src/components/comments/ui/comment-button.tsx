import { Button, Icon, cn } from "@triad/ui";
import { useMode } from "@triad/shared";
import { ModeState } from "@triad/storage";

function Ping() {
  return (
    <em className="tw-absolute tw-inline-flex -tw-right-1 -tw-top-1 tw-size-2.5 tw-rounded-full tw-bg-blue-500">
      <i className="tw-absolute tw-inline-flex tw-animate-ping tw-w-full tw-rounded-full tw-h-full tw-bg-blue-500" />
      <i className="tw-relative tw-inline-flex tw-size-2.5 tw-rounded-full tw-bg-blue-500" />
    </em>
  );
}

export function AddCommentButton() {
  const { mode, setMode, isCommentMode } = useMode();

  const handleToggleMode = (event: React.MouseEvent) => {
    // 이벤트 전파 방지 (comment click 이벤트가 실행되지 않도록)
    event.stopPropagation();
    event.preventDefault();

    const updatedMode: ModeState["mode"] =
      mode === "cursor" ? "comment" : "cursor";

    setMode(updatedMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "tw-h-8 tw-w-8 tw-rounded-full tw-transition-colors tw-cursor-none tw-relative",
        {
          "tw-text-gray-900 tw-bg-gray-100": isCommentMode,
          "tw-text-gray-300 hover:tw-text-gray-900 hover:tw-bg-gray-100":
            !isCommentMode,
        }
      )}
      onClick={handleToggleMode}
      title="댓글 입력"
    >
      <Icon name="MessageCircle" size="sm" />
      {mode === "comment" && <Ping />}
    </Button>
  );
}
