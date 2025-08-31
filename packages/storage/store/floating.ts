import { STORAGE_KEY } from "../constants/index.js";
import {
  FloatingState,
  FloatingStorage,
  StorageConfigType,
  StorageEnum,
} from "../types/index.js";
import { createStorage } from "./base.js";

const initialState: FloatingState = {
  showsFloating: false,
};

const options: StorageConfigType<FloatingState> = {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
};

const initialStore = createStorage<FloatingState>(
  STORAGE_KEY.FLOATING_STORAGE,
  initialState,
  options
);

const floatingStorage: FloatingStorage = {
  ...initialStore,
  toggleFloating: async () => {
    await initialStore.set((prevFloatingState) => {
      return {
        ...prevFloatingState,
        showsFloating: !prevFloatingState.showsFloating,
      };
    });
  },
};

export { floatingStorage };
