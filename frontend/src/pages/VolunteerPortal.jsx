import React, { useState, useEffect } from 'react';
import { Target, MapPin, Award } from 'lucide-react';

export default function VolunteerPortal() {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [matches, setMatches] = useState([]);

  // Registration states
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', skills: '', latitude: '', longitude: ''
  });

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = () => {
    fetch('http://localhost:8080/api/volunteers')
      .then(res => res.json())
      .then(data => setVolunteers(data))
      .catch(err => console.error(err));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };

    fetch('http://localhost:8080/api/volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(newVol => {
      setVolunteers([...volunteers, newVol]);
      setSelectedVolunteer(newVol);
      fetchMatches(newVol.id);
    });
  };

  const fetchMatches = (id) => {
    fetch(`http://localhost:8080/api/volunteers/${id}/matches`)
      .then(res => res.json())
      .then(data => setMatches(data))
      .catch(err => console.error(err));
  };

  const selectVolunteer = (v) => {
    setSelectedVolunteer(v);
    fetchMatches(v.id);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
      
      {/* Left Column: Registration & List */}
      <div>
        <h2>Volunteer Hub</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '32px' }}>
          Register to find tasks matched specifically to your location and skillset.
        </p>

        <form onSubmit={handleRegister} className="glass-panel" style={{ marginBottom: '32px' }}>
          <h3 style={{ marginTop: 0 }}>Onboard New Volunteer</h3>
          <input required className="form-control" style={{ marginBottom: '16px' }} placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
          <input required className="form-control" style={{ marginBottom: '16px' }} placeholder="Skills (e.g. Medical, Education)" value={formData.skills} onChange={e=>setFormData({...formData, skills:e.target.value})} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input required className="form-control" type="number" step="any" placeholder="Latitude" value={formData.latitude} onChange={e=>setFormData({...formData, latitude:e.target.value})} />
            <input required className="form-control" type="number" step="any" placeholder="Longitude" value={formData.longitude} onChange={e=>setFormData({...formData, longitude:e.target.value})} />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }}>Create Profile</button>
        </form>

        <h3 style={{ marginBottom: '16px' }}>Existing Volunteers</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {volunteers.map(v => (
            <div 
              key={v.id} 
              className="glass-panel" 
              style={{ padding: '12px', cursor: 'pointer', borderColor: selectedVolunteer?.id === v.id ? 'var(--primary)' : 'var(--glass-border)' }}
              onClick={() => selectVolunteer(v)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Award size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontWeight: 600 }}>{v.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Skills: {v.skills}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Matched Tasks */}
      <div className="glass-panel" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 0 }}>
          <Target size={24} color="var(--secondary)" /> AI Task Matches
        </h3>
        
        {!selectedVolunteer ? (
          <p style={{ color: '#cbd5e1', textAlign: 'center', marginTop: '64px' }}>
            Select or register a volunteer to view their smart-matched community needs.
          </p>
        ) : (
          <div>
            <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>
              Showing prioritized tasks for <strong>{selectedVolunteer.name}</strong> based on urgency, proximity, and skills ({selectedVolunteer.skills}).
            </p>
            {matches.length === 0 ? (
              <p style={{ color: '#fca5a5' }}>No tasks found matching this volunteer's skills within 50km radius.</p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {matches.map(task => (
                  <div key={task.id} className="feed-item glass-panel" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fff' }}>{task.title}</h4>
                      <span className={`status-pill status-${task.status}`}>{task.status.replace('_', ' ')}</span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '12px' }}>{task.description}</p>
                    <div style={{ display: 'flex', gap: '16px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={16} color="var(--primary)" /> Location: {task.latitude?.toFixed(2)}, {task.longitude?.toFixed(2)}
                      </span>
                      <span>Category: <strong>{task.category}</strong></span>
                      <span style={{ fontWeight: 600, color: task.urgency > 7 ? '#fca5a5' : '#fbbf24' }}>Urgency: {task.urgency}/10</span>
                    </div>
                    <button className="btn" style={{ marginTop: '16px', fontSize: '0.85rem' }}>Accept Task</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
