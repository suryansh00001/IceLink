import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChatPage from './pages/chat/ChatPage';
import CallHistory from './pages/call/CallHistory';
import ProtectedRoute from './components/common/protectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/:chatId" element={<ChatPage />} />
          <Route path="/call-history" element={<CallHistory />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
