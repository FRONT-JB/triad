import {
  Cursor,
  CursorBody,
  CursorComment,
  CursorMessage,
  CursorName,
} from "@triad/ui";

export default function CommentCursor({
  userName = "@You",
  userColor = "#3b82f6",
}: {
  userName?: string;
  userColor?: string;
}) {
  return (
    <Cursor userColor={userColor}>
      <CursorComment />
      <CursorBody>
        <CursorName>{userName}</CursorName>

        <CursorMessage className="tw-mt-1">
          코멘트 기능이 활성화됐어요.
        </CursorMessage>
      </CursorBody>
    </Cursor>
  );
}
