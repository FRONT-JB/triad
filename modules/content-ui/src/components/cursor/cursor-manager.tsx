import { useFloating } from "@triad/shared";
import { CustomCursor } from "./ui";

export function CursorManager() {
  const { showsFloating } = useFloating();

  if (!showsFloating) return null;
  //TODO: 추후에 이곳에서 세션에 접속한 사용자들의 커서를 렌더링
  return <CustomCursor />;
}
