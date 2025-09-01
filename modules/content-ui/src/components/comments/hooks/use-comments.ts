import { useState, useCallback, useRef } from "react";
import { Comment, User, CommentEvent } from "../types";

// 현재 사용자 정보 (임시로 하드코딩, 추후 인증 시스템과 연동)
const CURRENT_USER: User = {
  id: "current-user",
  name: "@You",
  color: "#3b82f6",
};

export function useComments() {
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isInputOpen, setIsInputOpen] = useState(false);
  // 하이라이트할 요소 정보 저장
  const [targetElementData, setTargetElementData] = useState<{
    targetElement: Element;
    elementSelector: string;
  } | null>(null);

  // 실시간 이벤트 핸들러 (추후 WebSocket 연결)
  const eventHandlerRef = useRef<((event: CommentEvent) => void) | null>(null);

  // 낙관적 업데이트로 댓글 추가 (내부용)
  const addComment = useCallback(
    (content: string) => {
      if (!targetElementData) return;

      const tempId = `temp_${Date.now()}`;
      const newComment: Comment = {
        id: tempId,
        content,
        targetElement: targetElementData.targetElement,
        elementSelector: targetElementData.elementSelector,
        timestamp: Date.now(),
        author: CURRENT_USER,
        isLocal: true,
        syncStatus: "pending",
      };

      // 낙관적 업데이트: 즉시 UI에 반영
      setCommentList((prev) => [...prev, newComment]);
      setIsInputOpen(false);
      setTargetElementData(null);

      // 서버 동기화 시뮬레이션 (추후 실제 API 호출로 대체)
      setTimeout(() => {
        const syncedComment: Comment = {
          ...newComment,
          id: `comment_${Date.now()}`, // 서버에서 받은 실제 ID
          syncStatus: "synced",
          isLocal: false,
        };

        setCommentList((prev) =>
          prev.map((comment) =>
            comment.id === tempId ? syncedComment : comment
          )
        );

        // 다른 사용자들에게 이벤트 전파
        if (eventHandlerRef.current) {
          eventHandlerRef.current({
            type: "comment_added",
            comment: syncedComment,
            userId: CURRENT_USER.id,
          });
        }
      }, 500);
    },
    [targetElementData]
  );

  // 원격 댓글 추가 (다른 사용자가 추가한 댓글)
  const addRemoteComment = useCallback((comment: Comment) => {
    setCommentList((prev) => {
      // 중복 방지
      if (prev.some((c) => c.id === comment.id)) {
        return prev;
      }
      return [...prev, comment];
    });
  }, []);

  // 댓글 입력 UI 열기
  const openCommentInput = useCallback(
    (data: { targetElement: Element; elementSelector: string }) => {
      // 하이라이트할 요소 정보 저장
      setTargetElementData(data);
      setIsInputOpen(true);
    },
    []
  );

  // 댓글 입력 UI 닫기
  const closeCommentInput = useCallback(() => {
    setIsInputOpen(false);
    setTargetElementData(null);
  }, []);

  // 댓글 삭제 (낙관적 업데이트)
  const deleteComment = useCallback((commentToDelete: Comment) => {
    setCommentList((prev) => {
      const filteredCommentList = prev.filter(
        (comment) => comment.id !== commentToDelete.id
      );
      return filteredCommentList;
    });

    // 서버 동기화는 추후 구현
    // API 호출 후 실패시 되돌리기 로직 필요
  }, []);

  // 실시간 이벤트 핸들러 등록 (추후 WebSocket 연결시 사용)
  const setEventHandler = useCallback(
    (handler: (event: CommentEvent) => void) => {
      eventHandlerRef.current = handler;
    },
    []
  );

  // 현재 사용자 정보
  const currentUser = CURRENT_USER;

  return {
    // 상태
    commentList,
    isInputOpen,
    targetElementData,
    currentUser,
    commentsCount: commentList.length,

    // 액션
    addComment,
    addRemoteComment,
    openCommentInput,
    closeCommentInput,
    deleteComment,
    setEventHandler,
  };
}
