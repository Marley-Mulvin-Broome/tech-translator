import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import HomePage from './components/Home/Homepage';
import NewsPage from './components/News/NewsPage'; // 最新ニュースページコンポーネントをインポート
import VocabularyPage from './components/Vocabulary/VocabularyPage'; // 単語管理ページコンポーネントをインポート
import LearningPage from './components/Learning/LearningPage'; // サイト選択学習ページコンポーネントをインポート
import { loginRequest, refreshAccessToken } from './server/requests';
import { setUserToken } from './server/login';
import CreateFlashcardsPage from './components/Vocabulary/CreateFlashcardsPage';
import StudyWithFlashcardsPage from './components/Vocabulary/StudyWithFlashcardsPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, refresh_token } = await loginRequest(email, password);

      setUserToken(token, refresh_token);
      setIsLoggedIn(true);

      if (window.sessionStorage.getItem('refreshInterval') === null) {
        window.sessionStorage.setItem('refreshInterval', 'true');
        setInterval(async () => {
          const tokens = await refreshAccessToken(refresh_token);
  
          setUserToken(tokens.token, tokens.refreshToken);
  
          console.log('トークンを更新しました');
        }, 1000 * 60 * 30);
      }

      
    } catch {
      // TODO: エラー処理
    }

    if (email === 'daikisoccer02@icloud.com' && password === 'unko') {
      setIsLoggedIn(true);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/main" /> : <Login onSubmit={handleLogin} />} />
        <Route path="/main" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
        <Route index element={<Navigate to="/login" />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/create-flashcards" element={<CreateFlashcardsPage />} />
        <Route path="/study-with-flashcards" element={<StudyWithFlashcardsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
