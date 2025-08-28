import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./side-panel.css";

const SidePanel: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, text: "이 부분 수정이 필요해요", author: "John", time: "2분 전" },
    { id: 2, text: "디자인이 깔끔하네요!", author: "Jane", time: "5분 전" },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          text: newComment,
          author: "Me",
          time: "방금 전",
        },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="side-panel">
      <div className="header">
        <h2>Triad</h2>
        <button
          onClick={handleConnect}
          className={`btn-connection ${isConnected ? "connected" : ""}`}
        >
          {isConnected ? "연결됨" : "연결하기"}
        </button>
      </div>

      <div className="section">
        <h3>실시간 커서</h3>
        <div className="cursors">
          {isConnected ? (
            <div className="cursor-item">
              <span className="cursor-dot blue"></span>
              <span>John (활성)</span>
            </div>
          ) : (
            <p className="empty-state">연결 후 팀원들의 커서를 확인하세요</p>
          )}
        </div>
      </div>

      <div className="section">
        <h3>댓글</h3>
        <div className="comments">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>{comment.author}</strong>
                <span className="time">{comment.time}</span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={3}
          />
          <button onClick={handleAddComment} className="btn-primary">
            댓글 추가
          </button>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<SidePanel />);
}
