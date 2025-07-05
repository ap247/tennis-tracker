import React, { useState, useMemo } from 'react';
import { Match } from '../types';

interface MatchHistoryProps {
  matches: Match[];
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({ matches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<'All' | 'Win' | 'Loss'>('All');
  const [filterSurface, setFilterSurface] = useState<'All' | 'Hard' | 'Clay' | 'Grass' | 'Indoor'>('All');

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const matchesSearch = match.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (match.tournament && match.tournament.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesResult = filterResult === 'All' || match.result === filterResult;
      const matchesSurface = filterSurface === 'All' || match.surface === filterSurface;
      
      return matchesSearch && matchesResult && matchesSurface;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [matches, searchTerm, filterResult, filterSurface]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card">
      <h2>Match History</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="filters">
        <button
          className={`filter-chip ${filterResult === 'All' ? 'active' : ''}`}
          onClick={() => setFilterResult('All')}
        >
          All
        </button>
        <button
          className={`filter-chip ${filterResult === 'Win' ? 'active' : ''}`}
          onClick={() => setFilterResult('Win')}
        >
          Wins
        </button>
        <button
          className={`filter-chip ${filterResult === 'Loss' ? 'active' : ''}`}
          onClick={() => setFilterResult('Loss')}
        >
          Losses
        </button>
        <button
          className={`filter-chip ${filterSurface === 'All' ? 'active' : ''}`}
          onClick={() => setFilterSurface('All')}
        >
          All Surfaces
        </button>
        <button
          className={`filter-chip ${filterSurface === 'Hard' ? 'active' : ''}`}
          onClick={() => setFilterSurface('Hard')}
        >
          Hard
        </button>
        <button
          className={`filter-chip ${filterSurface === 'Clay' ? 'active' : ''}`}
          onClick={() => setFilterSurface('Clay')}
        >
          Clay
        </button>
        <button
          className={`filter-chip ${filterSurface === 'Grass' ? 'active' : ''}`}
          onClick={() => setFilterSurface('Grass')}
        >
          Grass
        </button>
        <button
          className={`filter-chip ${filterSurface === 'Indoor' ? 'active' : ''}`}
          onClick={() => setFilterSurface('Indoor')}
        >
          Indoor
        </button>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="empty-state">
          <h3>No matches found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div>
          {filteredMatches.map(match => (
            <div key={match.id} className="match-item">
              <div className="match-header">
                <span className="match-opponent">{match.opponent}</span>
                <span className={`match-result ${match.result.toLowerCase()}`}>
                  {match.result}
                </span>
              </div>
              
              <div className="match-details">
                <span>{formatDate(match.date)}</span>
                <span className="match-score">{match.score}</span>
                <span>{match.surface}</span>
                <span>{match.location}</span>
                {match.tournament && <span>🏆 {match.tournament}</span>}
              </div>
              
              {match.notes && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Notes:</strong> {match.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};