import React, { useMemo } from 'react';
import { Match, Stats, Opponent } from '../types';

interface StatisticsProps {
  matches: Match[];
}

export const Statistics: React.FC<StatisticsProps> = ({ matches }) => {
  const stats = useMemo<Stats>(() => {
    const totalMatches = matches.length;
    const wins = matches.filter(m => m.result === 'Win').length;
    const losses = matches.filter(m => m.result === 'Loss').length;
    const winPercentage = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
    const setsPlayed = matches.reduce((acc, match) => acc + match.setsPlayed, 0);
    
    const scorelines: { [key: string]: number } = {};
    matches.forEach(match => {
      if (scorelines[match.score]) {
        scorelines[match.score]++;
      } else {
        scorelines[match.score] = 1;
      }
    });
    
    const commonScorelines = Object.entries(scorelines)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce((acc, [score, count]) => {
        acc[score] = count;
        return acc;
      }, {} as { [key: string]: number });

    return {
      totalMatches,
      wins,
      losses,
      winPercentage,
      setsPlayed,
      commonScorelines
    };
  }, [matches]);

  const opponents = useMemo<Opponent[]>(() => {
    const opponentMap: { [key: string]: Opponent } = {};
    
    matches.forEach(match => {
      if (!opponentMap[match.opponent]) {
        opponentMap[match.opponent] = {
          name: match.opponent,
          matches: 0,
          wins: 0,
          losses: 0
        };
      }
      
      opponentMap[match.opponent].matches++;
      if (match.result === 'Win') {
        opponentMap[match.opponent].wins++;
      } else {
        opponentMap[match.opponent].losses++;
      }
    });
    
    return Object.values(opponentMap).sort((a, b) => b.matches - a.matches);
  }, [matches]);

  const surfaceStats = useMemo(() => {
    const surfaces = ['Hard', 'Clay', 'Grass', 'Indoor'] as const;
    return surfaces.map(surface => {
      const surfaceMatches = matches.filter(m => m.surface === surface);
      const wins = surfaceMatches.filter(m => m.result === 'Win').length;
      const total = surfaceMatches.length;
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
      
      return {
        surface,
        matches: total,
        wins,
        losses: total - wins,
        winRate
      };
    }).filter(stat => stat.matches > 0);
  }, [matches]);

  const recentForm = useMemo(() => {
    const recent = matches
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    return recent.map(match => match.result === 'Win' ? 'W' : 'L');
  }, [matches]);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Performance Statistics</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.totalMatches}</div>
          <div className="stat-label">Total Matches</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.losses}</div>
          <div className="stat-label">Losses</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.winPercentage}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.setsPlayed}</div>
          <div className="stat-label">Sets Played</div>
        </div>
      </div>

      {recentForm.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ 
            marginBottom: '0.75rem', 
            color: 'var(--text-color)', 
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>Recent Form (Last 10)</h3>
          <div className="dark-section" style={{ 
            display: 'flex', 
            gap: '0.4rem', 
            padding: '1rem', 
            borderRadius: '12px',
            background: 'var(--stats-item-bg)',
            border: '1px solid var(--border-color)'
          }}>
            {recentForm.map((result, index) => (
              <span
                key={index}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  backgroundColor: result === 'W' ? 'var(--secondary-color)' : 'var(--danger-color)',
                  color: '#ffffff',
                  minWidth: '32px',
                  textAlign: 'center',
                  display: 'inline-block',
                  boxShadow: result === 'W' ? '0 2px 8px rgba(28, 231, 131, 0.3)' : '0 2px 8px rgba(249, 109, 109, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {result}
              </span>
            ))}
          </div>
        </div>
      )}

      {surfaceStats.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Performance by Surface</h3>
          {surfaceStats.map(stat => (
            <div key={stat.surface} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee'
            }}>
              <span>{stat.surface}</span>
              <span>{stat.wins}-{stat.losses} ({stat.winRate}%)</span>
            </div>
          ))}
        </div>
      )}

      {Object.keys(stats.commonScorelines).length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Common Scorelines</h3>
          {Object.entries(stats.commonScorelines).map(([score, count]) => (
            <div key={score} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.25rem 0'
            }}>
              <span>{score}</span>
              <span>{count} time{count > 1 ? 's' : ''}</span>
            </div>
          ))}
        </div>
      )}

      {opponents.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Top Opponents</h3>
          {opponents.slice(0, 5).map(opponent => (
            <div key={opponent.name} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee'
            }}>
              <span>{opponent.name}</span>
              <span>{opponent.wins}-{opponent.losses}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};