import { initAppWithShadow } from "@triad/shared";
import { CHROME_ACTION_TYPE } from "@triad/shared";
import inlineCss from "../dist/index.css?inline";
import App from "./App";

// Triad 활성 상태 관리
let isTriadActive = true;

// Chrome 메시지 리스너
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  switch (request.action) {
    case CHROME_ACTION_TYPE.GET_STATUS:
      sendResponse({ active: isTriadActive });
      break;
      
    case CHROME_ACTION_TYPE.TOGGLE_TRIAD:
      isTriadActive = !isTriadActive;
      const rootElement = document.getElementById("triad-content-ui-root");
      if (rootElement) {
        rootElement.style.display = isTriadActive ? "block" : "none";
      }
      sendResponse({ active: isTriadActive });
      break;
      
    default:
      sendResponse({ error: "Unknown action" });
      break;
  }
  return true; // 비동기 응답을 위해 true 반환
});

initAppWithShadow({
  id: "triad-content-ui-root",
  app: <App />,
  inlineCss: inlineCss,
});
