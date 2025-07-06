import React, { useState } from 'react';
import { Match } from '../types';
import { VisualScorekeeper } from './VisualScorekeeper';

interface MatchFormProps {
  onSubmit: (match: Omit<Match, 'id'>) => void;
}

export const MatchForm: React.FC<MatchFormProps> = ({ onSubmit }) => {
  const [useVisualScorekeeper, setUseVisualScorekeeper] = useState(false);
  const [formData, setFormData] = useState<{
    date: string;
    opponent: string;
    score: string;
    location: string;
    surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
    result: 'Win' | 'Loss';
    notes: string;
    tournament: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    score: '',
    location: '',
    surface: 'Hard',
    result: 'Win',
    notes: '',
    tournament: ''
  });

  const validateScoreVsResult = (score: string, result: string): string | null => {
    const sets = score.split(/[,\s]+/).filter(Boolean);
    
    // Parse each set to determine who won
    let playerWins = 0;
    let opponentWins = 0;
    
    for (const set of sets) {
      const scores = set.split('-').map(s => parseInt(s.trim()));
      if (scores.length === 2 && !isNaN(scores[0]) && !isNaN(scores[1])) {
        if (scores[0] > scores[1]) {
          playerWins++;
        } else if (scores[1] > scores[0]) {
          opponentWins++;
        }
      }
    }
    
    const playerWonMatch = playerWins > opponentWins;
    const resultIsWin = result === 'Win';
    
    if (playerWonMatch && !resultIsWin) {
      return 'Score indicates you won, but result is set to "Loss"';
    }
    
    if (!playerWonMatch && resultIsWin && opponentWins > 0) {
      return 'Score indicates you lost, but result is set to "Win"';
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate score vs result
    const validationError = validateScoreVsResult(formData.score, formData.result);
    if (validationError) {
      alert(`⚠️ Validation Error: ${validationError}\n\nPlease check your score and result.`);
      return;
    }
    
    const sets = formData.score.split(/[,\s]+/).filter(Boolean);
    const setsPlayed = sets.length;
    
    onSubmit({
      ...formData,
      setsPlayed
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      opponent: '',
      score: '',
      location: '',
      surface: 'Hard',
      result: 'Win',
      notes: '',
      tournament: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScoreChange = (score: string, result: 'Win' | 'Loss') => {
    setFormData(prev => ({
      ...prev,
      score,
      result
    }));
  };

  return (
    <div>
      <div className="logging-container">
        <div className="logging-header">
          <h2>Log New Match</h2>
        </div>
        
        {/* Score Input Method Toggle */}
        <div className="dark-section" style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>Score Input Method:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                checked={!useVisualScorekeeper}
                onChange={() => setUseVisualScorekeeper(false)}
              />
              Manual Entry
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                checked={useVisualScorekeeper}
                onChange={() => setUseVisualScorekeeper(true)}
              />
              Visual Scorekeeper
            </label>
          </div>
        </div>
      </div>

      {/* Visual Scorekeeper */}
      {useVisualScorekeeper && (
        <VisualScorekeeper onScoreChange={handleScoreChange} />
      )}

      <div className="logging-container">
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="opponent">Opponent</label>
          <input
            type="text"
            id="opponent"
            name="opponent"
            value={formData.opponent}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter opponent's name"
            required
          />
        </div>

        {!useVisualScorekeeper && (
          <>
            <div className="form-group">
              <label htmlFor="result">Result</label>
              <select
                id="result"
                name="result"
                value={formData.result}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="Win">Win</option>
                <option value="Loss">Loss</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="score">Score</label>
              <input
                type="text"
                id="score"
                name="score"
                value={formData.score}
                onChange={handleChange}
                className="form-input"
                placeholder="Your score first: e.g., 6-4, 6-2 (Win) or 4-6, 2-6 (Loss)"
                required
              />
              <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                📝 Enter your score first, then opponent's (e.g., "6-4, 7-5" means you won 6-4, 7-5)
              </small>
            </div>
          </>
        )}

        {useVisualScorekeeper && (
          <div className="form-group">
            <label>Current Score & Result</label>
            <div className="dark-section" style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <div><strong>Score:</strong> {formData.score || 'Enter scores above'}</div>
              <div><strong>Result:</strong> {formData.result}</div>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
            placeholder="Court location"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="surface">Surface</label>
          <select
            id="surface"
            name="surface"
            value={formData.surface}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Hard">Hard</option>
            <option value="Clay">Clay</option>
            <option value="Grass">Grass</option>
            <option value="Indoor">Indoor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tournament">Tournament (Optional)</label>
          <input
            type="text"
            id="tournament"
            name="tournament"
            value={formData.tournament}
            onChange={handleChange}
            className="form-input"
            placeholder="Tournament name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Strategy, mindset, physical condition, etc."
            rows={4}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full">
          Log Match
        </button>
        </form>
      </div>
    </div>
  );
};