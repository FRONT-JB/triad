import type { StorageEnum } from "./index.js";

type ValueOrUpdateType<D> = D | ((prev: D) => Promise<D> | D);

type BaseStorageType<D> = {
  get: () => Promise<D>;
  set: (value: ValueOrUpdateType<D>) => Promise<void>;
  getSnapshot: () => D | null;
  subscribe: (listener: () => void) => () => void;
};

type StorageConfigType<D = string> = {
  /**
   * 사용할 {@link StorageEnum}을 지정
   * @default Local
   */
  storageEnum?: StorageEnum;
  /**
   * {@link StorageEnum.Session}에만 적용: 콘텐츠 스크립트의 스토리지 영역 접근을 허용할지 여부
   * @default false
   */
  sessionAccessForContentScripts?: boolean;
  /**
   * 확장 프로그램의 모든 인스턴스 간에 상태를 실시간 동기화. 팝업, 사이드 패널, 콘텐츠 스크립트 간에 동기화.
   * 크롬 백그라운드 스크립트도 동기화하려면 {@link StorageEnum.Session} 스토리지 영역과
   * {@link StorageConfigType.sessionAccessForContentScripts}를 true로 설정 고려.
   * @see https://stackoverflow.com/a/75637138/2763239
   * @default false
   */
  liveUpdate?: boolean;
  /**
   * 스토리지에서 값을 가져오고 저장할 때 변환하는 선택적 속성
   * @default undefined
   */
  serialization?: {
    /**
     * 비네이티브 값을 스토리지에 저장하기 위해 문자열로 변환
     */
    serialize: (value: D) => string;
    /**
     * 스토리지의 문자열 값을 비네이티브 값으로 변환
     */
    deserialize: (text: string) => D;
  };
};

export type { ValueOrUpdateType, BaseStorageType, StorageConfigType };
