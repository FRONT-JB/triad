import React from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const Popup: React.FC = () => {
  const handleOpenSidePanel = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab.windowId) {
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  };

  return (
    <div className="popup">
      <div className="header">
        <h1>Triad</h1>
        <p>실시간 협업 도구</p>
      </div>

      <div className="content">
        <button onClick={handleOpenSidePanel} className="btn-primary">
          사이드패널 열기
        </button>

        <div className="status">
          <span className="status-dot"></span>
          연결됨
        </div>
      </div>

      <div className="footer">
        <small>v1.0.0</small>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}
