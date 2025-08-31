import { SessionAccessLevelEnum, StorageEnum } from "../types/enums.js";
import type {
  BaseStorageType,
  StorageConfigType,
  ValueOrUpdateType,
} from "../types/index.js";

/**
 * tailwindcss의 `processTailwindFeatures` 실행 시 Chrome 참조 에러 발생.
 * 이를 방지하기 위해 globalThis.chrome이 사용 가능한지 확인하고 폴백 로직을 추가.
 */
const chrome = globalThis.chrome;

/**
 * 임의의 캠시를 새 값 또는 업데이트 함수의 결과로 설정하거나 업데이트.
 */
const updateCache = async <D>(
  valueOrUpdate: ValueOrUpdateType<D>,
  cache: D | null
): Promise<D> => {
  // 값 또는 업데이트가 함수인지 확인하는 타입 가드
  const isFunction = <D>(
    value: ValueOrUpdateType<D>
  ): value is (prev: D) => D | Promise<D> => typeof value === "function";

  // 함수인 경우 Promise인지 확인하는 타입 가드
  const returnsPromise = <D>(
    func: (prev: D) => D | Promise<D>
  ): func is (prev: D) => Promise<D> =>
    // ReturnType을 사용하여 함수의 반환 타입을 추론하고 Promise인지 확인
    (func as (prev: D) => Promise<D>) instanceof Promise;
  if (isFunction(valueOrUpdate)) {
    // 함수가 Promise를 반환하는지 확인
    if (returnsPromise(valueOrUpdate)) {
      return valueOrUpdate(cache as D);
    } else {
      return valueOrUpdate(cache as D);
    }
  } else {
    return valueOrUpdate;
  }
};

/**
 * 하나의 세션 스토리지가 콘텐츠 스크립트에서 접근해야 하는 경우, 전역적으로 활성화 필요.
 * @default false
 */
let globalSessionAccessLevelFlag: StorageConfigType["sessionAccessForContentScripts"] = false;

/**
 * manifest.json에서 스토리지 권한이 부여되었는지 확인.
 */
const checkStoragePermission = (storageEnum: StorageEnum): void => {
  if (!chrome) {
    return;
  }

  if (!chrome.storage[storageEnum]) {
    throw new Error(
      `"storage" permission in manifest.ts: "storage ${storageEnum}" isn't defined`
    );
  }
};

/**
 * 데이터 지속 및 교환을 위한 스토리지 영역 생성.
 */
export const createStorage = <D = string>(
  key: string,
  fallback: D,
  config?: StorageConfigType<D>
): BaseStorageType<D> => {
  let cache: D | null = null;
  let initialCache = false;
  let listeners: Array<() => void> = [];

  const storageEnum = config?.storageEnum ?? StorageEnum.Local;
  const liveUpdate = config?.liveUpdate ?? false;

  const serialize = config?.serialization?.serialize ?? ((v: D) => v);
  const deserialize = config?.serialization?.deserialize ?? ((v) => v as D);

  // StorageEnum.Session에 대한 전역 세션 스토리지 접근 레벨 설정, 아직 수행되지 않았지만 필요한 경우에만.
  if (
    globalSessionAccessLevelFlag === false &&
    storageEnum === StorageEnum.Session &&
    config?.sessionAccessForContentScripts === true
  ) {
    checkStoragePermission(storageEnum);

    chrome?.storage[storageEnum]
      .setAccessLevel({
        accessLevel: SessionAccessLevelEnum.ExtensionPagesAndContentScripts,
      })
      .catch((error) => {
        console.error(error);
        console.error(
          "백그라운드 스크립트와 같은 다른 컨텍스트에서 .setAccessLevel()을 호출하세요."
        );
      });
    globalSessionAccessLevelFlag = true;
  }

  // 라이프사이클 메서드 등록
  const get = async (): Promise<D> => {
    checkStoragePermission(storageEnum);
    const value = await chrome?.storage[storageEnum].get([key]);

    if (!value) {
      return fallback;
    }

    return deserialize(value[key]) ?? fallback;
  };

  const set = async (valueOrUpdate: ValueOrUpdateType<D>) => {
    if (!initialCache) {
      cache = await get();
    }
    cache = await updateCache(valueOrUpdate, cache);

    await chrome?.storage[storageEnum].set({ [key]: serialize(cache) });
    _emitChange();
  };

  const subscribe = (listener: () => void) => {
    listeners = [...listeners, listener];

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const getSnapshot = () => cache;

  const _emitChange = () => {
    listeners.forEach((listener) => listener());
  };

  // 브라우저로부터의 실시간 업데이트를 위한 리스너
  const _updateFromStorageOnChanged = async (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    // 수신중인 키가 변경 객체에 있는지 확인
    if (changes[key] === undefined) return;

    const valueOrUpdate: ValueOrUpdateType<D> = deserialize(
      changes[key].newValue
    );

    if (cache === valueOrUpdate) return;

    cache = await updateCache(valueOrUpdate, cache);

    _emitChange();
  };

  get().then((data) => {
    cache = data;
    initialCache = true;
    _emitChange();
  });

  // 스토리지 영역의 실시간 업데이트를 위한 리스너 등록
  if (liveUpdate) {
    chrome?.storage[storageEnum].onChanged.addListener(
      _updateFromStorageOnChanged
    );
  }

  return {
    get,
    set,
    getSnapshot,
    subscribe,
  };
};
