import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, isGuest } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  const getUserAvatar = () => {
    if (isGuest) {
      return (
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'var(--secondary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          👤
        </div>
      );
    }
    
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      );
    }
    
    // Fallback for email users without photo
    return (
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '0.9rem'
      }}>
        {user.displayName ? user.displayName.charAt(0).toUpperCase() : '📧'}
      </div>
    );
  };

  const getUserTypeLabel = () => {
    if (isGuest) return 'Guest Mode';
    if (user.photoURL) return 'Google Account';
    return 'Email Account';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'var(--card-bg)',
      padding: '0.5rem 0.75rem',
      borderRadius: '25px',
      border: `1px solid ${isGuest ? 'var(--accent-color)' : 'var(--border-color)'}`,
      boxShadow: 'var(--shadow)',
      transition: 'all 0.3s ease',
      minWidth: '240px'
    }}>
      {getUserAvatar()}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{
          fontSize: '0.8rem',
          fontWeight: '500',
          color: 'var(--text-color)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '120px'
        }}>
          {user.displayName}
        </span>
        <span style={{
          fontSize: '0.7rem',
          color: isGuest ? 'var(--accent-color)' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '120px'
        }}>
          {getUserTypeLabel()}
        </span>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-color)',
          cursor: 'pointer',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          fontSize: '0.8rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          minWidth: '70px',
          justifyContent: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-color)';
          e.currentTarget.style.borderColor = 'var(--secondary-color)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--card-bg)';
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }}
        title={isGuest ? "Exit guest mode" : "Sign out"}
      >
        {isLoggingOut ? (
          <>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid transparent',
              borderTop: '2px solid var(--secondary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            ...
          </>
        ) : (
          isGuest ? 'Exit' : 'Sign Out'
        )}
      </button>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};