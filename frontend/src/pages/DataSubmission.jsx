import React, { useState } from 'react';
import { Sparkles, Send, RotateCcw } from 'lucide-react';

export default function DataSubmission() {
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [aiNote, setAiNote] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    urgency: 5,
    latitude: '',
    longitude: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleAnalyze = async () => {
    if (!rawText.trim()) return;
    setAnalyzing(true);
    setAiNote('');
    try {
      const res = await fetch('http://localhost:8080/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText })
      });
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        title: data.title || prev.title,
        description: data.description || prev.description,
        category: data.category || prev.category,
        urgency: data.urgency || prev.urgency
      }));
      if (data.ai_note) setAiNote(data.ai_note);
    } catch (err) {
      setAiNote('Could not reach AI service. Please fill in the form manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      urgency: parseInt(formData.urgency),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };
    fetch('http://localhost:8080/api/needs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => { if (res.ok) setSubmitted(true); });
  };

  const reset = () => {
    setSubmitted(false);
    setRawText('');
    setAiNote('');
    setFormData({ title: '', description: '', category: '', urgency: 5, latitude: '', longitude: '' });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2>Submit Community Data</h2>
      <p style={{ color: '#cbd5e1', marginBottom: '32px' }}>
        Paste raw field reports or paper survey notes — our AI extracts the key information automatically.
      </p>

      {submitted ? (
        <div className="glass-panel" style={{ textAlign: 'center', borderColor: 'var(--secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
          <h3 style={{ color: 'var(--secondary)' }}>Data Logged Successfully!</h3>
          <p style={{ color: '#cbd5e1' }}>The system is already matching available volunteers for this task.</p>
          <button className="btn" onClick={reset}><RotateCcw size={16} /> Submit Another Report</button>
        </div>
      ) : (
        <>
          {/* AI Analysis Box */}
          <div className="glass-panel" style={{ marginBottom: '24px', borderColor: 'rgba(167,139,250,0.3)' }}>
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#a78bfa" />
              <span style={{ background: 'linear-gradient(to right, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI-Powered Survey Analysis
              </span>
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '12px', fontSize: '0.9rem' }}>
              Paste raw text from a paper survey or field report. Gemini AI will auto-fill the form below.
            </p>
            <textarea
              className="form-control"
              rows="5"
              placeholder="e.g. 'Visited village in district 4. Found 3 children showing signs of malnutrition. No clean water access for 2 weeks. Families requesting urgent food and medical aid...'"
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              style={{ marginBottom: '12px', resize: 'vertical' }}
            />
            <button className="btn" onClick={handleAnalyze} disabled={analyzing || !rawText.trim()}
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', opacity: analyzing ? 0.7 : 1 }}>
              <Sparkles size={16} />
              {analyzing ? 'Analyzing with Gemini...' : 'Analyze with AI'}
            </button>
            {aiNote && (
              <p style={{ marginTop: '12px', color: '#fbbf24', fontSize: '0.85rem' }}>ℹ️ {aiNote}</p>
            )}
          </div>

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="glass-panel">
            <h3 style={{ marginTop: 0, color: '#cbd5e1' }}>Task Details <span style={{ fontSize: '0.85rem', fontWeight: 400 }}>(auto-filled or manual)</span></h3>
            <div className="form-group">
              <label>Task Title</label>
              <input required className="form-control" type="text" value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea required className="form-control" rows="3" value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  {['Medical', 'Food', 'Shelter', 'Education', 'Sanitation', 'Safety', 'General'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Urgency: <strong style={{ color: formData.urgency > 7 ? '#fca5a5' : '#fbbf24' }}>{formData.urgency}/10</strong></label>
                <input type="range" min="1" max="10" style={{ width: '100%', marginTop: '8px' }}
                  value={formData.urgency} onChange={e => setFormData({ ...formData, urgency: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Latitude</label>
                <input required className="form-control" type="number" step="any" value={formData.latitude}
                  onChange={e => setFormData({ ...formData, latitude: e.target.value })} placeholder="e.g. 13.0827" />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input required className="form-control" type="number" step="any" value={formData.longitude}
                  onChange={e => setFormData({ ...formData, longitude: e.target.value })} placeholder="e.g. 80.2707" />
              </div>
            </div>
            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              <Send size={16} /> Submit Task to Network
            </button>
          </form>
        </>
      )}
    </div>
  );
}
