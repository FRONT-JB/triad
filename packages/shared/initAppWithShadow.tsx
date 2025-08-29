import { createRoot } from "react-dom/client";
import type { ReactElement } from "react";

export const initAppWithShadow = ({
  id,
  app,
  inlineCss,
}: {
  id: string;
  inlineCss: string;
  app: ReactElement;
}) => {
  const root = document.createElement("div");
  root.id = id;

  document.body.append(root);

  const rootIntoShadow = document.createElement("div");
  rootIntoShadow.id = `shadow-root-${id}`;

  const shadowRoot = root.attachShadow({ mode: "open" });

  if (navigator.userAgent.includes("Firefox")) {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = inlineCss;
    shadowRoot.appendChild(styleElement);
  } else {
    const globalStyleSheet = new CSSStyleSheet();
    globalStyleSheet.replaceSync(inlineCss);
    shadowRoot.adoptedStyleSheets = [globalStyleSheet];
  }

  shadowRoot.appendChild(rootIntoShadow);
  createRoot(rootIntoShadow).render(app);
};
