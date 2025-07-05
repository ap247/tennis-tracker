import React, { useState, useEffect } from 'react';
import './App.css';
import { Match } from './types';
import { MatchForm } from './components/MatchForm';
import { MatchHistory } from './components/MatchHistory';
import { Statistics } from './components/Statistics';
import { matchService } from './services/matchService';

type ActiveTab = 'log' | 'history' | 'stats';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('log');
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedMatches = await matchService.getAllMatches();
      setMatches(fetchedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      setError('Failed to load matches. Using local storage as fallback.');
      
      // Fallback to localStorage
      try {
        const savedMatches = localStorage.getItem('tennis-matches');
        if (savedMatches) {
          const parsedMatches = JSON.parse(savedMatches);
          setMatches(Array.isArray(parsedMatches) ? parsedMatches : []);
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const matchId = await matchService.addMatch(matchData);
      const newMatch: Match = {
        ...matchData,
        id: matchId
      };
      setMatches(prev => [newMatch, ...prev]);
      setActiveTab('history');
      
      // Also save to localStorage as backup
      const updatedMatches = [newMatch, ...matches];
      localStorage.setItem('tennis-matches', JSON.stringify(updatedMatches));
    } catch (error) {
      console.error('Error adding match:', error);
      setError('Failed to save match. Please try again.');
      
      // Fallback to localStorage
      const newMatch: Match = {
        ...matchData,
        id: Date.now().toString()
      };
      setMatches(prev => [newMatch, ...prev]);
      localStorage.setItem('tennis-matches', JSON.stringify([newMatch, ...matches]));
      setActiveTab('history');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="card">
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
      <header className="header">
        <h1>🎾 Tennis Tracker</h1>
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
          <div className="card" style={{ backgroundColor: '#fff3cd', borderColor: '#ffeaa7', marginBottom: '1rem' }}>
            <div style={{ color: '#856404', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
