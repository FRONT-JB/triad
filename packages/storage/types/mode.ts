import { BaseStorageType } from "./index.js";

type ModeState = {
  mode: "cursor" | "comment";
};

type ModeStorage = BaseStorageType<ModeState> & {
  setMode: (newMode: ModeState["mode"]) => Promise<void>;
};

export type { ModeState, ModeStorage };
