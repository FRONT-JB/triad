import { useCallback, useEffect, useRef, useState } from "react";

export function useCursor() {
  const [{ x: posX, y: posY }, setPosition] = useState<{
    x: number;
    y: number;
  }>({
    // 페이지가 로드되기 전에 커서를 화면 밖으로 이동
    // 기본값으로 0을 사용하면 페이지가 로드됐을때 왼쪽 상단에 위치함
    x: -9999,
    y: -9999,
  });

  const [isVisible, setIsVisible] = useState(true);

  const cursorRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | undefined>(undefined);

  // 이벤트 핸들러들을 useCallback으로 메모이제이션
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // requestAnimationFrame으로 성능 최적화
    if (animationRef.current) return;

    animationRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      animationRef.current = undefined;
    });
  }, []);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // 스타일 주입 useEffect (한 번만 실행)
  useEffect(() => {
    const styleId = "custom-cursor-style";

    // 이미 스타일이 존재하면 스킵
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
          *, *::before, *::after {
            cursor: none !important;
          }
          body {
            cursor: none !important;
          }
        `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // 마우스 이벤트 리스너 useEffect
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return {
    cursorRef,
    posX,
    posY,
    isVisible,
  };
}
