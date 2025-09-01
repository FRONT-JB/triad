import { Z_INDEX } from "@triad/ui";
import { useState } from "react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
  targetElement?: Element;
}

export function CommentInput({
  onSubmit,
  onCancel,
  targetElement,
}: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  // 대상 요소의 위치를 기준으로 입력창 위치 계산
  const getInputPosition = () => {
    if (!targetElement) {
      return {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: Z_INDEX.COMMENT_INPUT,
      };
    }

    const rect = targetElement.getBoundingClientRect();

    const position = {
      position: "fixed" as const,
      left: rect.left,
      top: rect.bottom + 10, // 요소 바로 아래 10px 간격
      zIndex: Z_INDEX.COMMENT_INPUT,
    };

    return position;
  };

  return (
    <div
      data-triad-ui="comment-input-form"
      className="tw-fixed tw-bg-white tw-rounded-lg tw-shadow-xl tw-p-4 tw-min-w-80 tw-max-w-md"
      style={getInputPosition()}
      onClick={(e) => e.stopPropagation()}
    >
      <form onSubmit={handleSubmit}>
        <fieldset className="tw-mb-3">
          <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
            Add Comment
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your comment..."
            className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-md tw-resize-none tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-focus:border-transparent"
            rows={3}
            autoFocus
          />
        </fieldset>

        <fieldset className="tw-flex tw-gap-2 tw-justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="tw-px-4 tw-py-2 tw-text-gray-600 tw-border tw-border-gray-300 tw-rounded-md tw-hover:bg-gray-50 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-gray-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!content.trim()}
            className="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-md tw-hover:bg-blue-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500 tw-disabled:opacity-50 tw-disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </fieldset>
      </form>
    </div>
  );
}
