import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { SocketProvider } from "./context/SocketContext";
import { CallProvider } from "./context/CallContext";
import ErrorBoundary from './components/common/ErrorBoundary';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <SocketProvider>
            <CallProvider>
              <ChatProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
              </ChatProvider>
            </CallProvider>
          </SocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
);


