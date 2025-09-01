import { Cursor, CursorBody, CursorName, CursorPointer } from "@triad/ui";

export default function DefaultCursor({
  userName = "@You",
  userColor = "#3b82f6",
}: {
  userName?: string;
  userColor?: string;
}) {
  return (
    <Cursor userColor={userColor}>
      <CursorPointer />
      <CursorBody>
        <CursorName>{userName}</CursorName>
      </CursorBody>
    </Cursor>
  );
}
