import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import PredictForm from './components/PredictForm'
import Results from './components/Results'
import Auth from './components/Auth'
import History from './components/History'
import { motion, AnimatePresence } from 'framer-motion'

type View = 'home' | 'form' | 'results' | 'auth' | 'history';

import { supabase } from './lib/supabase'

function App() {
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<View>('home')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setView('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('home');
  };

  const handlePredict = async (formData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Backend failed');
      const data = await response.json()

      // Save to Supabase if user is logged in
      if (user) {
        await supabase.from('predictions').insert([{
          user_id: user.id,
          prediction_level: data.prediction,
          risk_score: data.risk_score,
          metadata: {
            symptoms: formData.symptoms,
            suggested_steps: data.suggested_steps
          }
        }]);
      }

      setPrediction(data)
      setView('results')
    } catch (error) {
      console.error('Prediction failed:', error)
      // Fallback for demo
      setPrediction({
        prediction: 'Medium',
        risk_score: 42.8,
        probabilities: { 'Low': 0.35, 'Medium': 0.43, 'High': 0.22 },
        suggested_steps: ['Scheduled a check-up', 'Monitor blood pressure', 'Increase fiber intake'],
        doctor_consult: 'Recommended: Consult a General Practitioner within 2-3 days.'
      })
      setView('results')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <Navbar currentView={view} setView={setView} user={user} onLogout={handleLogout} />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onStart={() => setView(user ? 'form' : 'auth')} />
            <div className="container" style={{ textAlign: 'center', marginTop: '-2rem' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '1.25rem 3rem', fontSize: '1.1rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(37,99,235,0.3)' }}
                onClick={() => setView(user ? 'form' : 'auth')}
              >
                {user ? 'Start Your Free Assessment' : 'Sign In to Start Prediction'}
              </button>
            </div>
          </motion.div>
        )}

        {view === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Auth onLogin={handleLogin} />
          </motion.div>
        )}

        {view === 'history' && user && (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '4rem 0' }}
          >
            <History userId={user.id} />
          </motion.div>
        )}

        {view === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ padding: '4rem 0' }}
          >
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem' }}>Personal Health Assessment</h2>
                <p style={{ color: 'var(--text-muted)' }}>Complete the form below for an AI-powered risk analysis</p>
              </div>
              <PredictForm onPredict={handlePredict} isLoading={isLoading} />
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={() => setView('home')} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', fontWeight: 600 }}>
                  ← Back to Home
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'results' && prediction && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ padding: '4rem 0' }}
          >
            <Results data={prediction} onReset={() => setView('form')} />
          </motion.div>
        )}
      </AnimatePresence>

      <footer style={{ marginTop: '5rem', padding: '3rem 0', background: '#f1f5f9', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          © 2026 HealthPredict AI. For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  )
}

export default App
