import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/needs')
      .then(res => res.json())
      .then(data => setNeeds(data))
      .catch(err => console.error("Error fetching needs:", err));
  }, []);

  const openNeeds = needs.filter(n => n.status === 'OPEN').length;
  const inProgress = needs.filter(n => n.status === 'IN_PROGRESS').length;
  const resolved = needs.filter(n => n.status === 'RESOLVED').length;

  return (
    <div className="animate-fade-in">
      <h2>NGO Command Dashboard</h2>
      <p style={{ color: '#cbd5e1', marginBottom: '32px' }}>
        Overview of aggregated community needs from surveys and field reports.
      </p>

      <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
        <div className="glass-panel metric-card">
          <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <AlertCircle size={32} />
          </div>
          <div className="metric-info">
            <h3>{openNeeds}</h3>
            <p>Open Urgent Needs</p>
          </div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
            <Clock size={32} />
          </div>
          <div className="metric-info">
            <h3>{inProgress}</h3>
            <p>Tasks In Progress</p>
          </div>
        </div>
        <div className="glass-panel metric-card">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            <CheckCircle size={32} />
          </div>
          <div className="metric-info">
            <h3>{resolved}</h3>
            <p>Needs Resolved</p>
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '16px' }}>Needs Feed Heatmap Data</h3>
        {needs.length === 0 ? (
          <p style={{ color: '#cbd5e1' }}>No needs reported yet. Add data from the submit tab.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {needs.sort((a,b) => b.urgency - a.urgency).map(need => (
              <div key={need.id} className="feed-item glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#fff' }}>{need.title}</h4>
                  <div style={{ display: 'flex', gap: '16px', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={16} /> Lat: {need.latitude?.toFixed(2)}, Lng: {need.longitude?.toFixed(2)}
                    </span>
                    <span>Category: <strong>{need.category}</strong></span>
                    <span style={{ color: need.urgency > 7 ? '#fca5a5' : '#fbbf24' }}>
                      Urgency: {need.urgency}/10
                    </span>
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: '#cbd5e1' }}>{need.description}</p>
                </div>
                <div>
                  <span className={`status-pill status-${need.status}`}>{need.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
