import { CHROME_ACTION_TYPE, useFloating } from "@triad/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  cn,
  Icon,
} from "@triad/ui";
import { AddCommentButton } from "./comments";

interface FloatingDockProps {
  className?: string;
}

function FloatingTrigger() {
  const { toggleFloating } = useFloating();

  return (
    <div
      className={cn(
        "tw-fixed tw-bottom-6 tw-right-3 tw-transform -tw-translate-x-1/2 tw-z-floating-dock",
        "tw-bg-[#060606]/85 tw-backdrop-blur-md",
        "tw-rounded-md tw-p-1 tw-shadow-2xl",
        "tw-flex tw-items-center tw-gap-2",
        "tw-transition-all tw-duration-300 tw-ease-in-out",
        "tw-hover:shadow-3xl tw-hover:scale-105"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="tw-h-8 tw-w-8 tw-rounded-full tw-transition-colors tw-text-gray-300 hover:tw-text-gray-900 hover:tw-bg-gray-100"
        onClick={toggleFloating}
        title="Dock 펼치기"
      >
        <Icon name="MonitorCog" size="sm" />
      </Button>
    </div>
  );
}

export function FloatingDock({ className }: FloatingDockProps) {
  const { showsFloating, toggleFloating } = useFloating();

  if (!showsFloating) return <FloatingTrigger />;

  const handleOpenSidePanel = () => {
    chrome.runtime.sendMessage({
      action: CHROME_ACTION_TYPE.OPEN_SIDE_PANEL,
    });
  };

  return (
    <div
      className={cn(
        "tw-fixed tw-bottom-6 tw-left-1/2 tw-transform -tw-translate-x-1/2 tw-z-floating-dock",
        "tw-bg-[#060606]/85 tw-backdrop-blur-md",
        "tw-rounded-xl tw-px-3 tw-py-2 tw-shadow-2xl",
        "tw-flex tw-items-center tw-gap-2",
        "tw-transition-all tw-duration-300 tw-ease-in-out",
        "tw-hover:shadow-3xl tw-hover:scale-105",
        className
      )}
    >
      <div className="tw-flex tw-items-center tw-gap-1">
        <AddCommentButton />

        <Button
          variant="ghost"
          size="icon"
          className="tw-h-8 tw-w-8 tw-rounded-full tw-transition-colors tw-text-gray-300 hover:tw-text-gray-900 hover:tw-bg-gray-100 tw-cursor-none"
          title="모든 댓글 보기"
          onClick={handleOpenSidePanel}
        >
          <Icon name="Server" size="sm" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="tw-h-8 tw-w-8 tw-rounded-full tw-transition-colors tw-text-gray-300 hover:tw-text-gray-900 hover:tw-bg-gray-100 tw-cursor-none"
          title="댓글 새로고침"
        >
          <Icon name="RotateCcw" size="sm" />
        </Button>
      </div>

      <div className="tw-w-[1px] tw-h-6 tw-bg-gray-500/20" />

      <div className="tw-flex tw-items-center tw--space-x-1 tw-px-1">
        <Avatar className="tw-h-8 tw-w-8 tw-ring-2 tw-ring-green-500">
          <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
          <AvatarFallback className="tw-bg-green-500 tw-text-white">
            A
          </AvatarFallback>
        </Avatar>

        <Avatar className="tw-h-8 tw-w-8 tw-ring-2 tw-ring-red-500">
          <AvatarImage src="https://github.com/shadcn.png" alt="User 2" />
          <AvatarFallback className="tw-bg-red-500 tw-text-white">
            B
          </AvatarFallback>
        </Avatar>

        <Avatar className="tw-h-8 tw-w-8 tw-ring-2 tw-ring-orange-500">
          <AvatarImage src="https://github.com/shadcn.png" alt="User 3" />
          <AvatarFallback className="tw-bg-orange-500 tw-text-white">
            C
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="tw-w-[1px] tw-h-6 tw-bg-gray-500/20" />

      <Button
        variant="ghost"
        size="icon"
        className="tw-h-8 tw-w-8 tw-rounded-full tw-transition-colors tw-text-gray-300 hover:tw-text-gray-900 hover:tw-bg-gray-100 tw-cursor-none"
        onClick={toggleFloating}
        title="Dock 접기"
      >
        <Icon name="MonitorOff" size="sm" />
      </Button>
    </div>
  );
}
