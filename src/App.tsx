import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Match } from './types';
import { MatchForm } from './components/MatchForm';
import { MatchHistory } from './components/MatchHistory';
import { Statistics } from './components/Statistics';
import { ThemeToggle } from './components/ThemeToggle';
import { Login } from './components/Login';
import { UserProfile } from './components/UserProfile';
import { useAuth } from './contexts/AuthContext';
import { matchService } from './services/matchService';

type ActiveTab = 'log' | 'history' | 'stats';

function App() {
  const { user, loading: authLoading, isGuest } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('log');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (isGuest) {
        // For guest users, load only from localStorage
        try {
          const savedMatches = localStorage.getItem(`tennis-matches-${user.uid}`);
          if (savedMatches) {
            const parsedMatches = JSON.parse(savedMatches);
            setMatches(Array.isArray(parsedMatches) ? parsedMatches : []);
          } else {
            setMatches([]);
          }
        } catch (localError) {
          console.error('Error loading guest matches from localStorage:', localError);
          setMatches([]);
        }
      } else {
        // For authenticated users, try Firebase first
        console.log('🔥 Firebase Config Check:', {
          apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
          projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
          authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
        });
        
        try {
          const fetchedMatches = await matchService.getAllMatches(user.uid);
          setMatches(fetchedMatches);
        } catch (firebaseError) {
          console.error('❌ Firebase error, falling back to localStorage:', firebaseError);
          setError('Cloud sync unavailable. Using local data.');
          
          // Fallback to localStorage for authenticated users
          try {
            const savedMatches = localStorage.getItem(`tennis-matches-${user.uid}`);
            if (savedMatches) {
              const parsedMatches = JSON.parse(savedMatches);
              setMatches(Array.isArray(parsedMatches) ? parsedMatches : []);
            } else {
              setMatches([]);
            }
          } catch (localError) {
            console.error('Error loading from localStorage:', localError);
            setMatches([]);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user, isGuest]);

  useEffect(() => {
    if (user) {
      loadMatches();
    } else {
      setLoading(false);
      setMatches([]);
    }
  }, [user, loadMatches]);

  const handleAddMatch = async (matchData: Omit<Match, 'id'>) => {
    if (!user) return;
    
    const newMatch: Match = {
      ...matchData,
      id: Date.now().toString(),
      userId: user.uid
    };

    try {
      if (isGuest) {
        // For guest users, save only to localStorage
        setMatches(prev => [newMatch, ...prev]);
        const updatedMatches = [newMatch, ...matches];
        localStorage.setItem(`tennis-matches-${user.uid}`, JSON.stringify(updatedMatches));
        setActiveTab('history');
      } else {
        // For authenticated users, try Firebase first
        try {
          const firebaseMatchId = await matchService.addMatch(matchData, user.uid);
          const firebaseMatch: Match = {
            ...matchData,
            id: firebaseMatchId,
            userId: user.uid
          };
          setMatches(prev => [firebaseMatch, ...prev]);
          setActiveTab('history');
          
          // Also save to localStorage as backup
          const updatedMatches = [firebaseMatch, ...matches];
          localStorage.setItem(`tennis-matches-${user.uid}`, JSON.stringify(updatedMatches));
        } catch (firebaseError) {
          console.error('Firebase save failed, using localStorage:', firebaseError);
          setError('Cloud sync unavailable. Match saved locally.');
          
          // Fallback to localStorage only
          setMatches(prev => [newMatch, ...prev]);
          const updatedMatches = [newMatch, ...matches];
          localStorage.setItem(`tennis-matches-${user.uid}`, JSON.stringify(updatedMatches));
          setActiveTab('history');
        }
      }
    } catch (error) {
      console.error('Error adding match:', error);
      setError('Failed to save match. Please try again.');
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="app">
        <ThemeToggle />
        <header className="header">
          <h1>🎾 Breakpoint</h1>
        </header>
        <main className="main">
          <div className="logging-container" style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="logging-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Loading matches...</div>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'log':
        return <MatchForm onSubmit={handleAddMatch} />;
      case 'history':
        return <MatchHistory matches={matches} />;
      case 'stats':
        return <Statistics matches={matches} />;
      default:
        return <MatchForm onSubmit={handleAddMatch} />;
    }
  };

  return (
    <div className="app">
      <ThemeToggle />
      <UserProfile />
      <header className="header">
        <h1>🎾 Breakpoint</h1>
        <nav className="nav">
          <button
            className={`nav-button ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => setActiveTab('log')}
          >
            Log Match
          </button>
          <button
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </nav>
      </header>

      <main className="main">
        {error && (
          <div className="card" style={{ backgroundColor: 'rgba(255, 155, 102, 0.1)', borderColor: 'var(--accent-color)', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--accent-color)', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          </div>
        )}
        
        {isGuest && (
          <div className="card" style={{ 
            backgroundColor: 'rgba(255, 155, 102, 0.1)', 
            borderColor: 'var(--accent-color)', 
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>
              📱 <strong>Guest Mode:</strong> Your matches are saved locally only. 
              <button 
                onClick={() => setActiveTab('log')} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--secondary-color)', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: '0.5rem'
                }}
              >
                Create an account to sync across devices
              </button>
            </div>
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
