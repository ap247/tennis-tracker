import React, { useState } from 'react';
import { Match } from '../types';

interface MatchFormProps {
  onSubmit: (match: Omit<Match, 'id'>) => void;
}

export const MatchForm: React.FC<MatchFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    score: '',
    location: '',
    surface: 'Hard' as const,
    result: 'Win' as const,
    notes: '',
    tournament: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

  return (
    <div className="card">
      <h2>Log New Match</h2>
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
            placeholder="e.g., 6-4, 6-2 or 6-4 6-2"
            required
          />
        </div>

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
  );
};