import React, { useState, useEffect } from 'react';
import { Comment, User, MESSAGES } from '@triad/shared';

const SidePanel: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'You', color: '#007acc', avatar: '👤' },
    { id: '2', name: 'John', color: '#ff6b35', avatar: '👨' },
    { id: '3', name: 'Jane', color: '#00c851', avatar: '👩' },
  ]);
  const [currentTab, setCurrentTab] = useState<'comments' | 'users' | 'settings'>('comments');

  useEffect(() => {
    // 다크모드 설정 불러오기
    chrome.storage.local.get(['theme'], (result) => {
      setIsDarkMode(result.theme === 'dark');
    });

    // 댓글 데이터 불러오기 (실제로는 현재 페이지의 댓글들)
    loadCommentsForCurrentPage();
  }, []);

  const loadCommentsForCurrentPage = () => {
    // 임시 데이터
    setComments([
      {
        id: 1,
        x: 100,
        y: 100,
        text: "이 부분에 대한 논의가 필요합니다",
        author: "John",
        timestamp: Date.now() - 3600000
      },
      {
        id: 2,
        x: 200,
        y: 300,
        text: "UI 개선 아이디어: 버튼을 더 크게 만들면 어떨까요?",
        author: "Jane",
        timestamp: Date.now() - 1800000
      }
    ]);
  };

  const handleToggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    chrome.storage.local.set({ theme: newTheme });
  };

  const handleGotoGithub = () => {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/triad'
    });
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGotoGithub}
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center hover:shadow-lg transition-shadow"
            title="GitHub에서 보기"
          >
            <span className="text-white font-bold text-sm">T</span>
          </button>
          <div>
            <h1 className="font-semibold">Triad</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">실시간 협업 도구</p>
          </div>
        </div>
        
        <button
          onClick={handleToggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="테마 전환"
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'comments', label: '댓글', icon: '💬' },
          { key: 'users', label: '사용자', icon: '👥' },
          { key: 'settings', label: '설정', icon: '⚙️' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCurrentTab(tab.key as any)}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              currentTab === tab.key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {currentTab === 'comments' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">페이지 댓글</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {comments.length}개
              </span>
            </div>
            
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="text-4xl mb-2">💬</div>
                <p>아직 댓글이 없습니다</p>
                <p className="text-sm">페이지에서 더블클릭하여 댓글을 추가하세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(comment.timestamp!)}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      위치: ({comment.x}, {comment.y})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'users' && (
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold mb-4">활성 사용자</h2>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">온라인</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="p-4 space-y-6">
            <h2 className="text-lg font-semibold mb-4">설정</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">다크 모드</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    어두운 테마 사용
                  </div>
                </div>
                <button
                  onClick={handleToggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="font-medium mb-2">정보</div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div>버전: 1.0.0</div>
                  <div>모듈 위치: /modules/side-panel</div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={handleGotoGithub}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  GitHub에서 보기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidePanel;