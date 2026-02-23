import React from 'react';
import { Activity, User } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setView: (view: any) => void;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, user, onLogout }) => {
  return (
    <nav className="glass" style={{ margin: '1rem', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <div className="container" style={{ height: '4.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setView('home')}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem', color: 'white' }}>
            <Activity size={24} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>HealthPredict AI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => setView('home')}
            style={{ fontWeight: 600, color: currentView === 'home' ? 'var(--primary)' : 'var(--text-muted)', background: 'none' }}
          >
            Home
          </button>
          {user && (
            <button
              onClick={() => setView('history')}
              style={{ fontWeight: 600, color: currentView === 'history' ? 'var(--primary)' : 'var(--text-muted)', background: 'none' }}
            >
              Dashboard
            </button>
          )}
          <div style={{ width: '1px', height: '1.5rem', background: '#e2e8f0' }}></div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="var(--text-muted)" />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--risk-high)', background: 'none' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setView('auth')}>Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
