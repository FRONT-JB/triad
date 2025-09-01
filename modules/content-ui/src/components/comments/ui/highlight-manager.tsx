import { useEffect, useState } from "react";
import { Comment } from "../types";

interface HighlightManagerProps {
  commentList: Comment[];
  onCommentHover?: (comment: Comment | null) => void;
  onCommentDelete?: (comment: Comment) => void;
}

export function HighlightManager({
  commentList,
  onCommentHover,
  onCommentDelete,
}: HighlightManagerProps) {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // 하이라이트 스타일 적용
  useEffect(() => {
    const appliedElementList = new Set<Element>();

    commentList.forEach((comment) => {
      const element = comment.targetElement;
      if (!element || !document.contains(element)) return;

      // 원본 스타일 백업 (한 번만)
      if (!comment.originalStyle) {
        comment.originalStyle = element.getAttribute("style") || "";
      }

      // 하이라이트 스타일 적용 (shadow 사용으로 레이아웃 영향 없음)
      const currentStyle = element.getAttribute("style") || "";
      const highlightStyle = `
        background-color: ${comment.author.color}15 !important;
        box-shadow: 0 0 0 2px ${comment.author.color}, 0 4px 8px ${comment.author.color}30 !important;
        border-radius: 4px !important;
        position: relative !important;
        transition: box-shadow 0.2s ease !important;
      `;

      element.setAttribute("style", `${currentStyle}; ${highlightStyle}`);
      element.setAttribute("data-comment-id", comment.id);
      element.setAttribute("data-comment-author", comment.author.name);

      // 호버 및 클릭 이벤트 추가
      const handleMouseEnter = () => {
        const rect = element.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2, // 요소 중앙
          y: rect.top - 10, // 요소 위쪽 10px
        });
        setHoveredComment(comment);
        onCommentHover?.(comment);

        // hover 시 shadow 강화
        const enhancedStyle = `
          background-color: ${comment.author.color}25 !important;
          box-shadow: 0 0 0 3px ${comment.author.color}, 0 6px 12px ${comment.author.color}40 !important;
          border-radius: 4px !important;
          position: relative !important;
          transition: box-shadow 0.2s ease !important;
        `;

        element.setAttribute(
          "style",
          `${element.getAttribute("style")?.replace(/background-color:[^;]*;|box-shadow:[^;]*;/g, "")}; ${enhancedStyle}`
        );
      };

      const handleMouseLeave = () => {
        setHoveredComment(null);
        onCommentHover?.(null);

        // hover 해제 시 원래 스타일로 복원
        element.setAttribute("style", `${currentStyle}; ${highlightStyle}`);
      };

      const handleClick = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        if (onCommentDelete) {
          const shouldDelete = confirm(
            `Delete comment by ${comment.author.name}?\n\n"${comment.content}"`
          );

          if (shouldDelete) {
            // 툴팁 즉시 숨기기
            setHoveredComment(null);
            onCommentHover?.(null);
            onCommentDelete(comment);
          }
        } else {
          console.log("No onCommentDelete function provided");
        }
      };

      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      element.addEventListener("click", handleClick);

      appliedElementList.add(element);

      // 클린업 함수를 위해 이벤트 리스너를 요소에 저장
      (element as any)._commentEventListeners = {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        click: handleClick,
      };
    });

    // 클린업: 컴포넌트 언마운트 또는 commentList 변경 시
    return () => {
      appliedElementList.forEach((element) => {
        const listeners = (element as any)._commentEventListeners;
        if (listeners) {
          element.removeEventListener("mouseenter", listeners.mouseenter);
          element.removeEventListener("mouseleave", listeners.mouseleave);
          element.removeEventListener("click", listeners.click);
          delete (element as any)._commentEventListeners;
        }

        // 스타일 복원
        const commentId = element.getAttribute("data-comment-id");
        const comment = commentList.find((c) => c.id === commentId);
        if (comment?.originalStyle !== undefined) {
          if (comment.originalStyle) {
            element.setAttribute("style", comment.originalStyle);
          } else {
            element.removeAttribute("style");
          }
        }

        // 데이터 속성 제거
        element.removeAttribute("data-comment-id");
        element.removeAttribute("data-comment-author");
      });
    };
  }, [commentList, onCommentHover]);

  // commentList가 변경될 때 현재 hoveredComment가 삭제되었는지 확인
  useEffect(() => {
    if (hoveredComment) {
      const commentListExists = commentList.some(
        (c) => c.id === hoveredComment.id
      );

      if (!commentListExists) {
        setHoveredComment(null);
        onCommentHover?.(null);
      }
    }
  }, [commentList, hoveredComment, onCommentHover]);

  if (!hoveredComment) return;

  return (
    <div
      className="tw-fixed tw-z-comment-tooltip tw-bg-gray-900 tw-text-white tw-text-sm tw-rounded-lg tw-px-4 tw-py-3 tw-max-w-sm tw-shadow-2xl tw-pointer-events-none tw-border tw-border-gray-600"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: "translate(-50%, -100%)", // 요소 위쪽에 표시
      }}
    >
      {/* 삼각형 화살표 - 아래쪽을 가리킴 */}
      <div className="tw-absolute tw--bottom-2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw-w-0 tw-h-0 tw-border-l-8 tw-border-r-8 tw-border-t-8 tw-border-l-transparent tw-border-r-transparent tw-border-t-gray-900"></div>

      <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
        <div
          className="tw-w-3 tw-h-3 tw-rounded-full tw-flex-shrink-0"
          style={{ backgroundColor: hoveredComment.author.color }}
        ></div>
        <div className="tw-font-semibold">{hoveredComment.author.name}</div>
        <div className="tw-text-xs tw-opacity-75">
          {new Date(hoveredComment.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="tw-whitespace-pre-wrap tw-leading-relaxed">
        {hoveredComment.content}
      </div>

      {/* 삭제 버튼 추가 */}
      <div className="tw-mt-2 tw-pt-2 tw-border-t tw-border-gray-700">
        <div className="tw-text-xs tw-opacity-75">
          Click the highlighted element to delete this comment
        </div>
      </div>
    </div>
  );
}
