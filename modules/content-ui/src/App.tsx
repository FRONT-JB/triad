import React from "react";
import { FloatingDock, CursorManager } from "./components";

const App: React.FC = () => {
  return (
    <>
      <CursorManager />
      <FloatingDock />
    </>
  );
};

export default App;
