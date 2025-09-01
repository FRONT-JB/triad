import { useEffect, useCallback, useState } from "react";
import { useFloating, useMode } from "@triad/shared";
import { generateStableSelector } from "../utils";

// 안정적인 속성 기반 선택자 생성

export function useCommentClick(
  onCommentClick: (data: {
    targetElement: Element;
    elementSelector: string;
  }) => void
) {
  const { isCommentMode } = useMode();
  const { showsFloating } = useFloating();
  
  // hover 시 미리보기 스타일을 위한 상태
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!isCommentMode || !showsFloating) {
        return;
      }

      // Triad UI 컴포넌트들 클릭 제외 (우리가 만든 dock, input 등)
      const target = event.target as Element;

      const isTriadUI =
        target.closest("[data-triad-ui]") ||
        target.closest(".tw-z-floating-dock") ||
        target.closest(".tw-fixed.tw-inset-0.tw-bg-black") || // comment input modal
        target.hasAttribute("data-triad-ui") ||
        target.classList.toString().includes("floating-dock") ||
        target.classList.toString().includes("comment-input") ||
        target.id === "triad-content-ui-root" || // 우리 앱의 루트 요소
        target.closest("#triad-content-ui-root"); // 루트 요소 하위

      // 이미 댓글이 있는 요소인지 확인
      const hasComment =
        target.hasAttribute("data-comment-id") ||
        target.closest("[data-comment-id]");

      if (isTriadUI || hasComment) {
        return;
      }

      // 클릭된 요소 찾기
      const targetElement = document.elementFromPoint(
        event.clientX,
        event.clientY
      );

      if (!targetElement) {
        return;
      }

      // 요소 선택자 생성
      const elementSelector = generateStableSelector(targetElement);

      onCommentClick({
        targetElement,
        elementSelector,
      });
    },
    [isCommentMode, showsFloating, onCommentClick]
  );

  // hover 시 미리보기 효과를 위한 핸들러들
  const handleMouseEnter = useCallback((event: MouseEvent) => {
    if (!isCommentMode || !showsFloating) return;

    const target = event.target as Element;
    
    // Triad UI 컴포넌트들과 기존 댓글 요소는 제외
    const isTriadUI =
      target.closest("[data-triad-ui]") ||
      target.closest(".tw-z-floating-dock") ||
      target.hasAttribute("data-triad-ui") ||
      target.id === "triad-content-ui-root" ||
      target.closest("#triad-content-ui-root");

    const hasComment =
      target.hasAttribute("data-comment-id") ||
      target.closest("[data-comment-id]");

    if (isTriadUI || hasComment) return;

    // 미리보기 스타일 적용
    const originalStyle = target.getAttribute('style') || '';
    const previewStyle = `
      ${originalStyle};
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), 0 4px 8px rgba(59, 130, 246, 0.2) !important;
      background-color: rgba(59, 130, 246, 0.05) !important;
      border-radius: 4px !important;
      transition: all 0.2s ease !important;
    `;

    target.setAttribute('style', previewStyle);
    target.setAttribute('data-comment-preview', 'true');
    (target as any)._originalStyle = originalStyle;
    
    setHoveredElement(target);
  }, [isCommentMode, showsFloating]);

  const handleMouseLeave = useCallback((event: MouseEvent) => {
    if (!isCommentMode || !showsFloating) return;

    const target = event.target as Element;
    
    if (target.hasAttribute('data-comment-preview')) {
      const originalStyle = (target as any)._originalStyle || '';
      target.setAttribute('style', originalStyle);
      target.removeAttribute('data-comment-preview');
      delete (target as any)._originalStyle;
    }
    
    setHoveredElement(null);
  }, [isCommentMode, showsFloating]);

  // Comment 모드에서 특정 요소들의 기본 액션만 방지하는 핸들러
  const preventDefaultActions = useCallback(
    (event: Event) => {
      if (!isCommentMode || !showsFloating) return;

      const target = event.target as Element;

      // Triad UI 컴포넌트들은 정상 동작하도록 허용
      const isTriadUI =
        target.closest("[data-triad-ui]") ||
        target.closest(".tw-z-floating-dock") ||
        target.hasAttribute("data-triad-ui") ||
        target.id === "triad-content-ui-root" ||
        target.closest("#triad-content-ui-root");

      if (isTriadUI) return;

      // 기존 댓글이 있는 요소는 삭제 기능이 작동하도록 허용
      const hasComment =
        target.hasAttribute("data-comment-id") ||
        target.closest("[data-comment-id]");
      if (hasComment) return;

      // 액션이 있는 요소들만 기본 동작 방지
      const isActionElement =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("form") ||
        target.hasAttribute("onclick") ||
        target.hasAttribute("href");

      if (isActionElement) {
        console.log("Preventing default action for:", target.tagName);
        event.preventDefault();
        // stopPropagation은 하지 않음 - comment 이벤트가 처리되도록 허용
      }
    },
    [isCommentMode, showsFloating]
  );

  useEffect(() => {
    if (!isCommentMode || !showsFloating) {
      return;
    }

    // capture 단계에서 모든 기본 액션을 먼저 방지
    document.addEventListener("click", preventDefaultActions, true);
    document.addEventListener("mousedown", preventDefaultActions, true);
    document.addEventListener("mouseup", preventDefaultActions, true);

    // hover 미리보기 효과
    document.addEventListener("mouseover", handleMouseEnter, true);
    document.addEventListener("mouseout", handleMouseLeave, true);

    // bubble 단계에서 comment 처리
    document.addEventListener("click", handleClick, false);

    return () => {
      console.log("Removing event listeners from document");
      document.removeEventListener("click", preventDefaultActions, true);
      document.removeEventListener("mousedown", preventDefaultActions, true);
      document.removeEventListener("mouseup", preventDefaultActions, true);
      document.removeEventListener("mouseover", handleMouseEnter, true);
      document.removeEventListener("mouseout", handleMouseLeave, true);
      document.removeEventListener("click", handleClick, false);
    };
  }, [isCommentMode, showsFloating, handleClick, preventDefaultActions, handleMouseEnter, handleMouseLeave]);

  // comment 모드가 비활성화될 때 남은 미리보기 스타일 정리
  useEffect(() => {
    if (!isCommentMode || !showsFloating) {
      // 모든 미리보기 스타일 제거
      const previewElements = document.querySelectorAll('[data-comment-preview="true"]');
      previewElements.forEach(element => {
        const originalStyle = (element as any)._originalStyle || '';
        element.setAttribute('style', originalStyle);
        element.removeAttribute('data-comment-preview');
        delete (element as any)._originalStyle;
      });
      setHoveredElement(null);
    }
  }, [isCommentMode, showsFloating]);
}
