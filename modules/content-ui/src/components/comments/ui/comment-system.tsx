import { useComments } from "../hooks/use-comments";
import { useCommentClick } from "../hooks/use-comment-click";
import { CommentInput } from "./comment-input";
import { HighlightManager } from "./highlight-manager";

export function CommentSystem() {
  const {
    commentList,
    isInputOpen,
    targetElementData,
    addComment,
    openCommentInput,
    closeCommentInput,
    deleteComment,
  } = useComments();

  useCommentClick(openCommentInput);

  return (
    <>
      {/* 하이라이트 관리자 - 요소에 직접 스타일 적용 */}
      <HighlightManager
        commentList={commentList}
        onCommentDelete={deleteComment}
      />

      {/* 댓글 입력 컴포넌트 */}
      {isInputOpen && targetElementData && (
        <CommentInput
          targetElement={targetElementData.targetElement}
          onSubmit={addComment}
          onCancel={closeCommentInput}
        />
      )}
    </>
  );
}
