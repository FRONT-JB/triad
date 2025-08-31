/**
 * 데이터 저장 및 교환을 위한 스토리지 영역 타입
 * @see https://developer.chrome.com/docs/extensions/reference/storage/#overview
 */
export enum StorageEnum {
  /**
   * 브라우저 재시작 시에도 데이터를 로컬에 유지. 확장 프로그램 제거 시 삭제됨.
   * @default
   */
  Local = "local",
  /**
   * 사용자 계정의 클라우드에 데이터를 업로드하고 다른 기기의 브라우저와 동기화. 제한 사항 적용.
   */
  Sync = "sync",
  /**
   * 회사 전체 설정을 위한 json 스키마와 함께 [엔터프라이즈 정책](https://www.chromium.org/administrators/configuring-policy-for-extensions)이 필요.
   */
  Managed = "managed",
  /**
   * 브라우저가 닫힐 때까지만 데이터 유지. 언제든 종료될 수 있어 상태 복원이 필요한 서비스 워커에 권장.
   * 콘텐츠 스크립트 접근을 허용하려면 {@link SessionAccessLevelEnum}을 설정.
   * @implements Chromes [Session Storage](https://developer.chrome.com/docs/extensions/reference/storage/#property-session)
   */
  Session = "session",
}

/**
 * {@link StorageEnum.Session} 스토리지 영역에 대한 전역 접근 레벨 요구사항
 * @implements Chromes [Session Access Level](https://developer.chrome.com/docs/extensions/reference/storage/#method-StorageArea-setAccessLevel)
 */
export enum SessionAccessLevelEnum {
  /**
   * 확장 프로그램 페이지에서만 스토리지에 접근 가능 (콘텐츠 스크립트는 불가)
   * @default
   */
  ExtensionPagesOnly = "TRUSTED_CONTEXTS",
  /**
   * 확장 프로그램 페이지와 콘텐츠 스크립트 모두에서 스토리지에 접근 가능
   */
  ExtensionPagesAndContentScripts = "TRUSTED_AND_UNTRUSTED_CONTEXTS",
}
