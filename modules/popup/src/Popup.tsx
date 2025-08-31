import React, { useState, useEffect } from "react";
import { useFloating } from "@triad/shared";
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
    chrome.runtime.sendMessage({ action: "open-side-panel" });
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
      className={`w-80 p-4 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <h1 className="text-lg font-semibold">Triad</h1>
        </div>

        <Button variant="default" onClick={handleToggleTheme} title="테마 전환">
          {isDarkMode ? "🌞" : "🌙"}
        </Button>
      </div>

      {/* 상태 표시 */}
      <div className="mb-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            showsFloating
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              showsFloating ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          {showsFloating ? "Active" : "Inactive"}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          웹페이지에서 팀원들과 실시간으로 협업하세요
        </div>

        {isUnsupportedUrl ? (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 이 페이지에서는 Triad를 사용할 수 없습니다.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={toggleFloating}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                showsFloating
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {showsFloating ? "Triad 비활성화" : "Triad 활성화"}
            </button>

            <button
              onClick={handleOpenSidePanel}
              className="w-full py-2 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              사이드 패널 열기
            </button>
          </div>
        )}

        {/* 도움말 */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
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
