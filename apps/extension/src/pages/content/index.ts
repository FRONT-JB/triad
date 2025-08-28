let isTriadActive = false;
let cursorElement: HTMLElement | null = null;
let commentMarkers: HTMLElement[] = [];
let floatingBar: HTMLElement | null = null;

function createCursor() {
  if (cursorElement) return cursorElement;

  const cursor = document.createElement("div");
  cursor.id = "triad-cursor";
  cursor.style.cssText = `
    position: absolute;
    width: 20px;
    height: 20px;
    background: #007acc;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: all 0.1s ease;
    box-shadow: 0 2px 8px rgba(0, 122, 204, 0.3);
  `;

  const label = document.createElement("div");
  label.style.cssText = `
    position: absolute;
    top: 25px;
    left: 0;
    background: #007acc;
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    white-space: nowrap;
  `;
  label.textContent = "You";

  cursor.appendChild(label);
  document.body.appendChild(cursor);
  cursorElement = cursor;

  return cursor;
}

function updateCursorPosition(x: number, y: number) {
  if (!cursorElement) return;

  cursorElement.style.left = `${x}px`;
  cursorElement.style.top = `${y}px`;
}

function createCommentMarker(x: number, y: number, comment: string) {
  const marker = document.createElement("div");
  marker.className = "triad-comment-marker";
  marker.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    width: 24px;
    height: 24px;
    background: #ff6b35;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    z-index: 9999;
    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
    font-weight: bold;
  `;

  marker.textContent = "💬";
  marker.title = comment;

  marker.addEventListener("click", (e) => {
    e.stopPropagation();
    showCommentTooltip(marker, comment);
  });

  document.body.appendChild(marker);
  commentMarkers.push(marker);

  return marker;
}

function showCommentTooltip(marker: HTMLElement, comment: string) {
  const existing = document.querySelector(".triad-tooltip");
  if (existing) existing.remove();

  const tooltip = document.createElement("div");
  tooltip.className = "triad-tooltip";
  tooltip.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 12px;
    max-width: 200px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 1.4;
  `;

  tooltip.textContent = comment;

  const rect = marker.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

  document.body.appendChild(tooltip);

  setTimeout(() => {
    if (tooltip.parentNode) {
      tooltip.remove();
    }
  }, 3000);
}

function createFloatingBar() {
  if (floatingBar) return floatingBar;

  const bar = document.createElement("div");
  bar.id = "triad-floating-bar";
  bar.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(60, 60, 60, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 25px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10002;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `;

  // 댓글 버튼
  const commentBtn = document.createElement("button");
  commentBtn.innerHTML = "💬";
  commentBtn.title = "댓글 추가";
  commentBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s;
  `;
  commentBtn.onmouseover = () => commentBtn.style.background = "rgba(255, 255, 255, 0.1)";
  commentBtn.onmouseout = () => commentBtn.style.background = "none";
  commentBtn.onclick = () => {
    const comment = prompt("댓글을 입력하세요:");
    if (comment && comment.trim()) {
      createCommentMarker(window.innerWidth / 2, window.innerHeight / 2, comment.trim());
    }
  };

  // 커서 토글 버튼
  const cursorBtn = document.createElement("button");
  cursorBtn.innerHTML = "👆";
  cursorBtn.title = "커서 표시 토글";
  cursorBtn.style.cssText = commentBtn.style.cssText;
  cursorBtn.onmouseover = () => cursorBtn.style.background = "rgba(255, 255, 255, 0.1)";
  cursorBtn.onmouseout = () => cursorBtn.style.background = "none";
  cursorBtn.onclick = () => {
    if (cursorElement) {
      cursorElement.style.display = cursorElement.style.display === "none" ? "block" : "none";
    }
  };

  // 사이드패널 버튼
  const sidePanelBtn = document.createElement("button");
  sidePanelBtn.innerHTML = "📋";
  sidePanelBtn.title = "사이드패널 열기";
  sidePanelBtn.style.cssText = commentBtn.style.cssText;
  sidePanelBtn.onmouseover = () => sidePanelBtn.style.background = "rgba(255, 255, 255, 0.1)";
  sidePanelBtn.onmouseout = () => sidePanelBtn.style.background = "none";
  sidePanelBtn.onclick = () => {
    chrome.runtime.sendMessage({ action: "open-side-panel" });
  };

  // 사용자 아바타들 (더미 데이터)
  const users = [
    { name: "You", color: "#007acc", avatar: "👤" },
    { name: "John", color: "#ff6b35", avatar: "👨" },
    { name: "Jane", color: "#00c851", avatar: "👩" }
  ];

  users.forEach((user, index) => {
    const avatar = document.createElement("div");
    avatar.style.cssText = `
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: ${user.color};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.2s;
    `;
    avatar.innerHTML = user.avatar;
    avatar.title = user.name;
    avatar.onmouseover = () => avatar.style.transform = "scale(1.1)";
    avatar.onmouseout = () => avatar.style.transform = "scale(1)";
    
    bar.appendChild(avatar);
    
    // 첫 번째 사용자 후 구분선 추가
    if (index === 0) {
      const divider = document.createElement("div");
      divider.style.cssText = `
        width: 1px;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        margin: 0 4px;
      `;
      bar.appendChild(divider);
    }
  });

  // 더보기 버튼
  const moreBtn = document.createElement("button");
  moreBtn.innerHTML = "⋯";
  moreBtn.title = "더보기";
  moreBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.2s;
  `;
  moreBtn.onmouseover = () => moreBtn.style.background = "rgba(255, 255, 255, 0.1)";
  moreBtn.onmouseout = () => moreBtn.style.background = "none";

  bar.appendChild(commentBtn);
  bar.appendChild(cursorBtn);
  bar.appendChild(sidePanelBtn);
  bar.appendChild(moreBtn);

  document.body.appendChild(bar);
  floatingBar = bar;

  return bar;
}

function initializeTriad() {
  if (isTriadActive) return;

  isTriadActive = true;
  console.log("Triad Content Script 활성화됨");

  createFloatingBar();

  document.addEventListener("mousemove", (e) => {
    if (!cursorElement) createCursor();
    updateCursorPosition(e.pageX, e.pageY);
  });

  document.addEventListener("dblclick", (e) => {
    const comment = prompt("댓글을 입력하세요:");
    if (comment && comment.trim()) {
      createCommentMarker(e.pageX, e.pageY, comment.trim());
    }
  });

  createCommentMarker(
    100,
    100,
    "샘플 댓글입니다. 더블클릭하여 새 댓글을 추가하세요!"
  );
}

function cleanupTriad() {
  if (cursorElement) {
    cursorElement.remove();
    cursorElement = null;
  }

  if (floatingBar) {
    floatingBar.remove();
    floatingBar = null;
  }

  commentMarkers.forEach((marker) => marker.remove());
  commentMarkers = [];

  const tooltips = document.querySelectorAll(".triad-tooltip");
  tooltips.forEach((tooltip) => tooltip.remove());

  isTriadActive = false;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "toggle-triad") {
    if (isTriadActive) {
      cleanupTriad();
    } else {
      initializeTriad();
    }
    sendResponse({ active: isTriadActive });
  } else if (message.action === "get-status") {
    sendResponse({ active: isTriadActive });
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTriad);
} else {
  initializeTriad();
}
