import { createStorage } from "./base.js";
import {
  StorageConfigType,
  StorageEnum,
  ModeState,
  ModeStorage,
} from "../types/index.js";

const initialState: ModeState = {
  mode: "cursor",
};

const options: StorageConfigType<ModeState> = {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
};

const initialStore = createStorage<ModeState>(
  "triad-mode",
  initialState,
  options
);

const modeStorage: ModeStorage = {
  ...initialStore,
  setMode: async (newMode: ModeState["mode"]) => {
    await initialStore.set(() => {
      return { mode: newMode };
    });
  },
};

export { modeStorage };
