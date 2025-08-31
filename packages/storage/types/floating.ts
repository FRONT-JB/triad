import { BaseStorageType } from "./index.js";

type FloatingState = {
  showsFloating: boolean;
};

type FloatingStorage = BaseStorageType<FloatingState> & {
  toggleFloating: () => Promise<void>;
};

export type { FloatingState, FloatingStorage };
