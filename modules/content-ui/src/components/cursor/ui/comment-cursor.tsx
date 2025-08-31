import { Cursor, CursorBody, CursorComment, CursorName } from "@triad/ui";

export default function CommentCursor({
  userName = "You",
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
      </CursorBody>
    </Cursor>
  );
}
