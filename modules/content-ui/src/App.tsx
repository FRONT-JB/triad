import React from "react";

const App: React.FC = () => {
  return (
    <div className="fixed left-0 right-0 bottom-6 z-extension bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h1 className="text-lg font-bold mb-2">Triad Content UI</h1>
      <p className="text-sm opacity-80">현재 URL: {window.location.href}</p>
      <p className="text-xs mt-2 text-green-400">
        ✅ 성공적으로 주입되었습니다!
      </p>
    </div>
  );
};

export default App;
