import React, { useState, useEffect } from 'react';

interface Set {
  playerGames: number;
  opponentGames: number;
  playerTiebreak?: number;
  opponentTiebreak?: number;
}

interface VisualScorekeeperProps {
  onScoreChange: (score: string, result: 'Win' | 'Loss') => void;
}

export const VisualScorekeeper: React.FC<VisualScorekeeperProps> = ({ onScoreChange }) => {
  const [numSets, setNumSets] = useState<number>(2);
  const [sets, setSets] = useState<Set[]>([
    { playerGames: 0, opponentGames: 0 },
    { playerGames: 0, opponentGames: 0 }
  ]);
  const [playerName, setPlayerName] = useState('You');
  const [opponentName, setOpponentName] = useState('Opponent');

  useEffect(() => {
    // Initialize sets array when numSets changes
    const newSets = Array.from({ length: numSets }, (_, i) => 
      sets[i] || { playerGames: 0, opponentGames: 0 }
    );
    setSets(newSets);
  }, [numSets]);

  useEffect(() => {
    // Calculate score string and result whenever sets change
    const scoreString = sets
      .filter(set => set.playerGames > 0 || set.opponentGames > 0)
      .map(set => {
        let setScore = `${set.playerGames}-${set.opponentGames}`;
        if (set.playerTiebreak !== undefined && set.opponentTiebreak !== undefined) {
          setScore += ` (${set.playerTiebreak}-${set.opponentTiebreak})`;
        }
        return setScore;
      })
      .join(', ');

    // Determine who won the match
    const setsWon = sets.reduce((acc, set) => {
      if (set.playerGames > set.opponentGames) acc.player++;
      else if (set.opponentGames > set.playerGames) acc.opponent++;
      return acc;
    }, { player: 0, opponent: 0 });

    const result: 'Win' | 'Loss' = setsWon.player > setsWon.opponent ? 'Win' : 'Loss';
    
    if (scoreString) {
      onScoreChange(scoreString, result);
    }
  }, [sets, onScoreChange]);

  const updateSetScore = (setIndex: number, field: keyof Set, value: number) => {
    setSets(prev => prev.map((set, i) => 
      i === setIndex ? { ...set, [field]: value } : set
    ));
  };

  const incrementScore = (setIndex: number, player: 'player' | 'opponent') => {
    const field = player === 'player' ? 'playerGames' : 'opponentGames';
    const currentValue = sets[setIndex][field];
    updateSetScore(setIndex, field, currentValue + 1);
  };

  const decrementScore = (setIndex: number, player: 'player' | 'opponent') => {
    const field = player === 'player' ? 'playerGames' : 'opponentGames';
    const currentValue = sets[setIndex][field];
    if (currentValue > 0) {
      updateSetScore(setIndex, field, currentValue - 1);
    }
  };

  const needsTiebreak = (set: Set) => {
    return set.playerGames === 6 && set.opponentGames === 6;
  };

  const getSetWinner = (set: Set) => {
    if (set.playerGames > set.opponentGames) return 'player';
    if (set.opponentGames > set.playerGames) return 'opponent';
    return null;
  };

  return (
    <div className="logging-container">
      <div className="logging-header">
        <h2>Visual Scorekeeper</h2>
      </div>
      
      {/* Configuration */}
      <div className="dark-section" style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Number of Sets
            </label>
            <select 
              value={numSets} 
              onChange={(e) => setNumSets(Number(e.target.value))}
              className="form-select"
              style={{ fontSize: '0.9rem' }}
            >
              <option value={1}>Best of 1</option>
              <option value={2}>Best of 2</option>
              <option value={3}>Best of 3</option>
              <option value={5}>Best of 5</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
              Opponent Name
            </label>
            <input
              type="text"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.9rem' }}
              placeholder="Opponent name"
            />
          </div>
        </div>
      </div>

      {/* Score Grid - Vertical Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sets.map((set, setIndex) => (
          <div key={setIndex} className={`scorekeeper-set ${getSetWinner(set) ? 'winner' : ''}`}>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '1rem', 
              fontSize: '1.1rem', 
              fontWeight: '600',
              color: 'var(--primary-color)',
              transition: 'color 0.3s ease'
            }}>
              Set {setIndex + 1}
              {getSetWinner(set) && (
                <span style={{ 
                  marginLeft: '0.5rem',
                  fontSize: '0.9rem',
                  color: getSetWinner(set) === 'player' ? 'var(--secondary-color)' : 'var(--danger-color)',
                  transition: 'color 0.3s ease'
                }}>
                  ({getSetWinner(set) === 'player' ? playerName : opponentName} won)
                </span>
              )}
            </div>
            
            {/* Player Score */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: getSetWinner(set) === 'player' ? 'rgba(2, 131, 96, 0.1)' : 'white',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                {playerName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => decrementScore(setIndex, 'player')}
                    className="btn"
                    style={{ 
                      minWidth: '40px', 
                      height: '40px', 
                      padding: '0', 
                      fontSize: '1rem',
                      backgroundColor: 'var(--danger-color)',
                      color: 'white',
                      borderRadius: '50%'
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '700', 
                    minWidth: '40px',
                    textAlign: 'center',
                    color: getSetWinner(set) === 'player' ? 'var(--secondary-color)' : 'inherit'
                  }}>
                    {set.playerGames}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementScore(setIndex, 'player')}
                    className="btn"
                    style={{ 
                      minWidth: '40px', 
                      height: '40px', 
                      padding: '0', 
                      fontSize: '1rem',
                      backgroundColor: 'var(--secondary-color)',
                      color: 'white',
                      borderRadius: '50%'
                    }}
                  >
                    +
                  </button>
                </div>
                
                {needsTiebreak(set) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>TB:</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={set.playerTiebreak || 0}
                      onChange={(e) => updateSetScore(setIndex, 'playerTiebreak', Number(e.target.value))}
                      style={{ 
                        width: '60px', 
                        textAlign: 'center', 
                        fontSize: '1rem',
                        padding: '0.25rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Opponent Score */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0.75rem',
              backgroundColor: getSetWinner(set) === 'opponent' ? 'rgba(249, 109, 109, 0.1)' : 'white',
              borderRadius: '6px',
              border: '1px solid #dee2e6'
            }}>
              <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                {opponentName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => decrementScore(setIndex, 'opponent')}
                    className="btn"
                    style={{ 
                      minWidth: '40px', 
                      height: '40px', 
                      padding: '0', 
                      fontSize: '1rem',
                      backgroundColor: 'var(--danger-color)',
                      color: 'white',
                      borderRadius: '50%'
                    }}
                  >
                    -
                  </button>
                  <span style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '700', 
                    minWidth: '40px',
                    textAlign: 'center',
                    color: getSetWinner(set) === 'opponent' ? 'var(--danger-color)' : 'inherit'
                  }}>
                    {set.opponentGames}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementScore(setIndex, 'opponent')}
                    className="btn"
                    style={{ 
                      minWidth: '40px', 
                      height: '40px', 
                      padding: '0', 
                      fontSize: '1rem',
                      backgroundColor: 'var(--secondary-color)',
                      color: 'white',
                      borderRadius: '50%'
                    }}
                  >
                    +
                  </button>
                </div>
                
                {needsTiebreak(set) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>TB:</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={set.opponentTiebreak || 0}
                      onChange={(e) => updateSetScore(setIndex, 'opponentTiebreak', Number(e.target.value))}
                      style={{ 
                        width: '60px', 
                        textAlign: 'center', 
                        fontSize: '1rem',
                        padding: '0.25rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Match Summary */}
        <div className="dark-section" style={{ 
          padding: '1rem',
          borderRadius: '8px',
          border: '2px solid var(--primary-color)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Match Score
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600' }}>{playerName}</div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: 'var(--secondary-color)'
              }}>
                {sets.filter(set => getSetWinner(set) === 'player').length}
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#666' }}>
              -
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{opponentName}</div>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: '700',
                color: 'var(--danger-color)'
              }}>
                {sets.filter(set => getSetWinner(set) === 'opponent').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
        💡 Use +/- buttons to track games. When a set reaches 6-6, enter tiebreak scores.
      </div>
    </div>
  );
};