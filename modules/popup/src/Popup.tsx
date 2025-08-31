import React, { useState, useEffect } from "react";
import { CHROME_ACTION_TYPE, useFloating } from "@triad/shared";
import { Button } from "@triad/ui";

const Popup: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { showsFloating, toggleFloating } = useFloating();

  useEffect(() => {
    // 현재 탭 정보 가져오기
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });

    // 다크모드 설정 불러오기
    chrome.storage.local.get(["theme"], (result) => {
      setIsDarkMode(result.theme === "dark");
    });
  }, []);

  const handleOpenSidePanel = () => {
    chrome.runtime.sendMessage({
      action: CHROME_ACTION_TYPE.OPEN_SIDE_PANEL,
    });
  };

  const handleToggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    chrome.storage.local.set({ theme: newTheme });
  };

  const isUnsupportedUrl =
    currentUrl.startsWith("chrome://") ||
    currentUrl.startsWith("chrome-extension://") ||
    currentUrl.startsWith("about:");

  return (
    <div
      className={`tw-w-80 tw-p-4 ${
        isDarkMode
          ? "tw-bg-gray-800 tw-text-white"
          : "tw-bg-white tw-text-gray-900"
      }`}
    >
      {/* 헤더 */}
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-w-8 tw-h-8 tw-bg-gradient-to-br tw-from-blue-500 tw-to-purple-600 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
            <span className="tw-text-white tw-font-bold tw-text-lg">T</span>
          </div>
          <h1 className="tw-text-lg tw-font-semibold">Triad</h1>
        </div>

        <Button variant="default" onClick={handleToggleTheme} title="테마 전환">
          {isDarkMode ? "🌞" : "🌙"}
        </Button>
      </div>

      {/* 상태 표시 */}
      <div className="tw-mb-4">
        <div
          className={`tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2 tw-rounded-full tw-text-[14px] tw-font-medium ${
            showsFloating
              ? "tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-200"
              : "tw-bg-gray-100 tw-text-gray-600 dark:tw-bg-gray-700 dark:tw-text-gray-400"
          }`}
        >
          <div
            className={`tw-w-2 tw-h-2 tw-rounded-full ${
              showsFloating ? "tw-bg-green-500" : "tw-bg-gray-400"
            }`}
          ></div>
          {showsFloating ? "Active" : "Inactive"}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="tw-space-y-3">
        <div className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
          웹페이지에서 팀원들과 실시간으로 협업하세요
        </div>

        {isUnsupportedUrl ? (
          <div className="tw-p-2 tw-bg-yellow-50 dark:tw-bg-yellow-900/20 tw-border tw-border-yellow-200 dark:tw-border-yellow-800 tw-rounded-lg">
            <div className="tw-text-sm tw-text-yellow-800 dark:tw-text-yellow-200">
              ⚠️ 이 페이지에서는 Triad를 사용할 수 없습니다.
            </div>
          </div>
        ) : (
          <div className="tw-space-y-2">
            <button
              onClick={toggleFloating}
              className={`tw-w-full tw-py-2 tw-px-4 tw-rounded-lg tw-font-medium tw-transition-colors ${
                showsFloating
                  ? "tw-bg-red-500 hover:tw-bg-red-600 tw-text-white"
                  : "tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white"
              }`}
            >
              {showsFloating ? "Triad 비활성화" : "Triad 활성화"}
            </button>

            <button
              onClick={handleOpenSidePanel}
              className="tw-w-full tw-py-2 tw-px-4 tw-rounded-lg tw-font-medium tw-border tw-border-gray-300 dark:tw-border-gray-600 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition-colors"
            >
              사이드 패널 열기
            </button>
          </div>
        )}

        {/* 도움말 */}
        <div className="tw-pt-2 tw-border-t tw-border-gray-200 dark:tw-border-gray-700">
          <div className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-space-y-[2px]">
            <div>💬 더블클릭으로 댓글 추가</div>
            <div>👆 커서 움직임 공유</div>
            <div>📋 사이드 패널에서 세부 설정</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
