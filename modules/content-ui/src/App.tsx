import React from "react";
import { FloatingDock, CursorManager, CommentSystem } from "./components";

const App: React.FC = () => {
  return (
    <>
      <CursorManager />

      <FloatingDock />

      <CommentSystem />
    </>
  );
};

export default App;
