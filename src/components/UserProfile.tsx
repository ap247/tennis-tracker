import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, isGuest } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowMenu(false);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  if (!user) return null;

  const getProfileLogo = () => {
    return (
      <div style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--secondary-color)',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}>
        🎾
      </div>
    );
  };

  const getUserTypeLabel = () => {
    if (isGuest) return 'Guest Mode';
    if (user.photoURL) return 'Google Account';
    return 'Email Account';
  };

  return (
    <div 
      className="user-profile-container"
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 10000
      }}
    >
      {/* Always show just the avatar button */}
      <div 
        className="profile-avatar"
        ref={menuRef}
        style={{
          position: 'relative'
        }}
      >
        <button
          className="avatar-button"
          onClick={toggleMenu}
          style={{
            background: 'var(--card-bg)',
            border: `2px solid ${isGuest ? 'var(--accent-color)' : 'var(--border-color)'}`,
            borderRadius: '50%',
            padding: '0.25rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: 'var(--shadow)',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow)';
          }}
        >
          {getProfileLogo()}
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div 
            className="profile-menu"
            style={{
              position: 'absolute',
              top: '46px',
              left: '0',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '0.75rem',
              minWidth: '240px',
              zIndex: 10001,
              animation: 'slideIn 0.2s ease'
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              {/* Profile Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isGuest ? 'var(--accent-color)' : 'var(--secondary-color)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {isGuest ? '🎾' : (user.photoURL ? 
                    <img src={user.photoURL} alt="Profile" style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} /> :
                    (user.displayName ? user.displayName.charAt(0).toUpperCase() : '📧')
                  )}
                </div>
                <div>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--text-color)',
                    marginBottom: '0.1rem'
                  }}>
                    {user.displayName || 'Anonymous User'}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: isGuest ? 'var(--accent-color)' : 'var(--text-muted)'
                  }}>
                    {getUserTypeLabel()}
                  </div>
                </div>
              </div>
              
              {/* Profile Details */}
              {!isGuest && user.email && (
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.25rem',
                  wordBreak: 'break-word'
                }}>
                  {user.email}
                </div>
              )}
              
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                paddingTop: '0.25rem',
                borderTop: '1px solid var(--border-color)'
              }}>
                {isGuest ? 
                  'Data stored locally only' : 
                  'Data synced to cloud'
                }
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                width: '100%',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                fontSize: '0.75rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-color)';
                e.currentTarget.style.borderColor = 'var(--secondary-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {isLoggingOut ? (
                <>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    border: '2px solid transparent',
                    borderTop: '2px solid var(--secondary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>...</span>
                </>
              ) : (
                <span>{isGuest ? 'Exit Guest Mode' : 'Sign Out'}</span>
              )}
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Profile menu styling */
        .profile-menu {
          backdrop-filter: blur(2px);
        }
      `}</style>
    </div>
  );
};