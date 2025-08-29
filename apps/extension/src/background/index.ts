chrome.runtime.onInstalled.addListener(() => {
  console.log("Triad 확장프로그램이 설치되었습니다.");
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: "get-status",
    });

    await chrome.tabs.sendMessage(tab.id, { action: "toggle-triad" });

    if (!response?.active) {
      chrome.action.setBadgeText({ text: "ON", tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: "#00c851" });
    } else {
      chrome.action.setBadgeText({ text: "", tabId: tab.id });
    }
  } catch (error) {
    console.log("Content script에 메시지 전송 실패:", error);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    !tab.url.startsWith("chrome://")
  ) {
    chrome.action.setBadgeText({ text: "", tabId });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "open-side-panel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.windowId) {
        chrome.sidePanel.open({ windowId: tabs[0].windowId });
      }
    });
  }
});
