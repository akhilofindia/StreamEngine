// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(10, 15, 30, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#f0f4ff',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              borderLeft: '3px solid #00e5ff',
              borderRadius: '0.75rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.1)',
              padding: '0.875rem 1rem',
            },
            success: {
              style: {
                borderLeft: '3px solid #00ff9d',
                border: '1px solid rgba(0, 255, 157, 0.2)',
              },
              iconTheme: { primary: '#00ff9d', secondary: 'rgba(10,15,30,0.95)' },
            },
            error: {
              style: {
                borderLeft: '3px solid #ff4444',
                border: '1px solid rgba(255, 68, 68, 0.2)',
              },
              iconTheme: { primary: '#ff4444', secondary: 'rgba(10,15,30,0.95)' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)