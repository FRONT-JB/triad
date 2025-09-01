import { ModeState, modeStorage } from "@triad/storage";
import { useStorage } from "./use-storage.js";

export function useMode() {
  const { mode } = useStorage(modeStorage);

  const setMode = (newMode: ModeState["mode"]) => {
    modeStorage.setMode(newMode);
  };

  const isCursorMode = mode === "cursor";
  const isCommentMode = mode === "comment";

  return {
    mode,
    setMode,
    isCursorMode,
    isCommentMode,
  };
}
