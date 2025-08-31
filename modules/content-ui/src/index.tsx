import { initAppWithShadow } from "@triad/shared";
import inlineCss from "../dist/index.css?inline";
import App from "./App";

initAppWithShadow({
  id: "triad-content-ui-root",
  app: <App />,
  inlineCss: inlineCss,
});
