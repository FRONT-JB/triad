import { useStorage } from "./use-storage.js";
import { floatingStorage } from "@triad/storage";

const useFloating = () => {
  const { showsFloating } = useStorage(floatingStorage);

  return {
    showsFloating,
    toggleFloating: floatingStorage.toggleFloating,
  };
};

export { useFloating };
