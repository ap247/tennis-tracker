import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EmailPasswordAuth } from './EmailPasswordAuth';

type AuthMode = 'main' | 'email' | 'guest';

export const Login: React.FC = () => {
  const { signInWithGoogle, signInAsGuest } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('main');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInAsGuest();
    } catch (error: any) {
      console.error('Guest login error:', error);
      setError(error.message || 'Failed to continue as guest');
    } finally {
      setIsLoading(false);
    }
  };

  // Show email/password auth component
  if (authMode === 'email') {
    return (
      <div className="app">
        <header className="header">
          <h1>🎾 Breakpoint</h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
            Track your tennis matches and improve your game
          </p>
        </header>
        <main className="main">
          <EmailPasswordAuth onBack={() => setAuthMode('main')} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎾 Breakpoint</h1>
        <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
          Track your tennis matches and improve your game
        </p>
      </header>

      <main className="main">
        <div className="logging-container" style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
          <div className="logging-header">
            <h2>Welcome to Breakpoint</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Choose how you'd like to get started
            </p>
          </div>

          {error && (
            <div className="card" style={{ 
              backgroundColor: 'rgba(216, 55, 42, 0.1)', 
              borderColor: 'var(--danger-color)', 
              marginBottom: '1rem',
              color: 'var(--danger-color)',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="btn btn-primary btn-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              padding: '1rem 1.5rem',
              marginBottom: '1rem'
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Signing in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Email/Password Sign In */}
          <button
            onClick={() => setAuthMode('email')}
            disabled={isLoading}
            className="btn btn-secondary btn-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              padding: '1rem 1.5rem',
              marginBottom: '1rem',
              background: 'var(--card-bg)',
              color: 'var(--text-color)',
              border: '2px solid var(--border-color)'
            }}
          >
            📧 Sign in with Email
          </button>

          {/* Divider */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '1.5rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
            <span style={{ padding: '0 1rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          </div>

          {/* Guest Mode */}
          <button
            onClick={handleGuestSignIn}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--secondary-color)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '1rem',
              padding: '0.5rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            👤 Continue as Guest (Local Storage Only)
          </button>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'rgba(36, 164, 127, 0.05)',
            borderRadius: '8px',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-color)' }}>Why create an account?</h4>
            <ul style={{ textAlign: 'left', margin: 0, paddingLeft: '1.2rem' }}>
              <li><strong>Cloud Sync:</strong> Access matches on any device</li>
              <li><strong>Backup:</strong> Never lose your tennis data</li>
              <li><strong>Advanced Stats:</strong> Enhanced analytics</li>
              <li><strong>Guest Mode:</strong> Try it out first (data stays local)</li>
            </ul>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};