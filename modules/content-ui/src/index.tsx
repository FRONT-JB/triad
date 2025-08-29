import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Comment } from "@triad/shared";
import "./style.css";

interface ContentUIAppProps {
  target: string;
}

const ContentUIApp: React.FC<ContentUIAppProps> = ({ target }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 초기 댓글 데이터
    setComments([
      {
        id: 1,
        x: 100,
        y: 100,
        text: `Content UI 주입됨: ${target}`,
        author: "System",
        timestamp: Date.now(),
      },
    ]);
  }, [target]);

  const handleAddComment = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const comment = prompt("댓글을 입력하세요:");

    if (comment?.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        text: comment.trim(),
        author: "User",
        timestamp: Date.now(),
      };

      setComments((prev) => [...prev, newComment]);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="triad-content-ui-wrapper fixed left-1/2 bottom-6 transform -translate-x-1/2 pointer-events-none z-extension"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >
      {/* 댓글 마커들 */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute w-6 h-6 bg-triad-secondary border-2 border-white rounded-full cursor-pointer z-extension-1 shadow-lg flex items-center justify-center text-xs text-white font-bold pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: comment.x, top: comment.y }}
          title={comment.text}
        >
          💬
        </div>
      ))}

      {/* 플로팅 툴바 */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl border border-white border-opacity-10 pointer-events-auto z-extension">
        <button
          onClick={handleAddComment}
          className="w-10 h-10 rounded-full bg-transparent hover:bg-white hover:bg-opacity-10 flex items-center justify-center text-lg transition-colors"
          title="댓글 추가"
        >
          💬
        </button>

        <button
          onClick={() => setIsVisible(false)}
          className="w-10 h-10 rounded-full bg-transparent hover:bg-white hover:bg-opacity-10 flex items-center justify-center text-lg transition-colors"
          title="숨기기"
        >
          👁️
        </button>

        <div className="w-px h-5 bg-white bg-opacity-20"></div>

        <div className="text-white text-sm opacity-80">Content UI Active</div>
      </div>
    </div>
  );
};

// 주입 함수
function injectContentUI() {
  const targetUrl = window.location.href;

  // Shadow DOM 생성
  const shadowHost = document.createElement("div");
  shadowHost.id = "triad-content-ui-root";
  shadowHost.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483647;
  `;

  const shadowRoot = shadowHost.attachShadow({ mode: "open" });

  // Tailwind CSS를 Shadow DOM에 주입
  const styleElement = document.createElement("style");
  
  // 빌드된 CSS 파일을 가져와서 주입
  fetch(chrome.runtime.getURL('content-ui/style.css'))
    .then(response => response.text())
    .then(css => {
      styleElement.textContent = css;
    })
    .catch(() => {
      // Fallback: 기본 스타일 적용
      styleElement.textContent = `
        * { box-sizing: border-box; }
        .fixed { position: fixed !important; }
        .absolute { position: absolute !important; }
        .left-1\\/2 { left: 50% !important; }
        .bottom-6 { bottom: 1.5rem !important; }
        .bottom-5 { bottom: 1.25rem !important; }
        .transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) !important; }
        .-translate-x-1\\/2 { --tw-translate-x: -50% !important; }
        .-translate-y-1\\/2 { --tw-translate-y: -50% !important; }
        .pointer-events-none { pointer-events: none !important; }
        .pointer-events-auto { pointer-events: auto !important; }
        .z-extension { z-index: 2147483647 !important; }
        .z-extension-1 { z-index: 2147483646 !important; }
        .w-6 { width: 1.5rem !important; }
        .h-6 { height: 1.5rem !important; }
        .w-10 { width: 2.5rem !important; }
        .h-10 { height: 2.5rem !important; }
        .bg-triad-secondary { background-color: #ff6b35 !important; }
        .bg-gray-800 { background-color: #1f2937 !important; }
        .bg-opacity-95 { background-color: rgba(31, 41, 55, 0.95) !important; }
        .border-2 { border-width: 2px !important; }
        .border-white { border-color: white !important; }
        .rounded-full { border-radius: 9999px !important; }
        .cursor-pointer { cursor: pointer !important; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important; }
        .flex { display: flex !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .text-xs { font-size: 0.75rem !important; }
        .text-sm { font-size: 0.875rem !important; }
        .text-lg { font-size: 1.125rem !important; }
        .text-white { color: white !important; }
        .font-bold { font-weight: 700 !important; }
        .backdrop-blur-sm { backdrop-filter: blur(4px) !important; }
        .px-4 { padding: 0.5rem 1rem !important; }
        .py-2 { padding: 0.5rem 0 !important; }
        .gap-3 { gap: 0.75rem !important; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
        .bg-transparent { background-color: transparent !important; }
        .hover\\:bg-white:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
        .hover\\:bg-opacity-10:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
        .transition-colors { transition: color 0.15s, background-color 0.15s !important; }
        .opacity-80 { opacity: 0.8 !important; }
        .w-px { width: 1px !important; }
        .h-5 { height: 1.25rem !important; }
        .bg-white { background-color: white !important; }
        .bg-opacity-20 { background-color: rgba(255, 255, 255, 0.2) !important; }
        .border { border-width: 1px !important; }
        .border-opacity-10 { border-color: rgba(255, 255, 255, 0.1) !important; }
        .triad-content-ui-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
      `;
    });
  
  shadowRoot.appendChild(styleElement);

  // React 앱 컨테이너
  const appContainer = document.createElement("div");
  shadowRoot.appendChild(appContainer);

  // 페이지에 추가
  document.body.appendChild(shadowHost);

  // React 앱 렌더링
  const root = createRoot(appContainer);
  root.render(<ContentUIApp target={targetUrl} />);

  console.log("🎨 Triad Content UI injected successfully");
}

// Chrome 메시지 리스너 추가
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Content script received message:", message);

  if (message.action === "get-status") {
    // Triad 활성 상태 반환
    sendResponse({
      active: document.getElementById("triad-content-ui-root") !== null,
    });
    return true;
  }

  if (message.action === "toggle-triad") {
    const existingUI = document.getElementById("triad-content-ui-root");

    if (existingUI) {
      // UI 제거
      existingUI.remove();
      sendResponse({ active: false });
      console.log("🔥 Triad Content UI removed");
    } else {
      // UI 주입
      injectContentUI();
      sendResponse({ active: true });
    }
    return true;
  }

  return false;
});

// DOM이 로드되면 주입
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", injectContentUI);
} else {
  injectContentUI();
}
