// 사용자 정보
export interface User {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

// 댓글 데이터 (하이라이트 기반)
export interface Comment {
  id: string;
  content: string;
  // 하이라이트 대상 요소 정보
  targetElement: Element; // 하이라이트할 실제 DOM 요소
  elementSelector: string; // 요소 식별용 CSS 선택자
  originalStyle?: string; // 원본 스타일 백업 (제거시 복원용)
  
  timestamp: number;
  author: User;
  // 실시간 협업용 메타데이터
  sessionId?: string; // 세션 식별
  isLocal?: boolean; // 로컬에서 생성된 댓글인지 (낙관적 업데이트용)
  syncStatus?: "pending" | "synced" | "failed"; // 동기화 상태
}


// 실시간 이벤트 타입들
export interface CommentEvent {
  type: "comment_added" | "comment_updated" | "comment_deleted";
  comment: Comment;
  userId: string;
}

// 커서 위치 공유용 (이후 확장)
export interface CursorPosition {
  userId: string;
  user: User;
  x: number;
  y: number;
  timestamp: number;
  mode: "cursor" | "comment";
}
