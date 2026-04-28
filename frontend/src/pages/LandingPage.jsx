import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '48px' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '16px' }}>Smart Resource Allocation</h1>
      <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 48px auto' }}>
        Data-driven volunteer coordination for maximum social impact. 
        We gather fragmented community needs and smart-match them with right volunteers.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '64px' }}>
        <Link to="/submit" className="btn">
          Submit Survey Data <ArrowRight size={18} />
        </Link>
        <Link to="/volunteer" className="btn secondary">
          Join as Volunteer
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel">
          <Globe size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h3>Community Mapping</h3>
          <p style={{ color: '#cbd5e1' }}>Visualizing the most urgent local needs across regions from scattered reports.</p>
        </div>
        <div className="glass-panel">
          <Users size={48} color="var(--secondary)" style={{ marginBottom: '16px' }} />
          <h3>Smart Matching</h3>
          <p style={{ color: '#cbd5e1' }}>AI-driven connection between available volunteers and specific local tasks.</p>
        </div>
        <div className="glass-panel">
          <TrendingUp size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h3>Impact Tracking</h3>
          <p style={{ color: '#cbd5e1' }}>Real-time updates on task resolution and volunteer coordination efficiency.</p>
        </div>
      </div>
    </div>
  );
}
