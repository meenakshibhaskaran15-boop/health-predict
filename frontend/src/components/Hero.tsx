import React from 'react';
import { ShieldCheck, Zap, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    return (
        <section style={{ padding: '4rem 0' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="risk-tag risk-low" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>AI-Powered Health Assistant</span>
                    <h1 style={{ fontSize: '3.5rem', maxWidth: '800px', margin: '0 auto 1.5rem', lineHeight: '1.1' }}>
                        Predict Your Health Risks with <span style={{ color: 'var(--primary)' }}>A.I. Precision</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        Get personalized health assessments and preventive care guidance based on your symptoms and lifestyle habits.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button className="btn btn-primary" style={{ padding: '1rem 2rem' }}>Start Free Assessment</button>
                        <button className="btn" style={{ background: 'white', border: '1px solid #e2e8f0', padding: '1rem 2rem' }}>How it works</button>
                    </div>
                </motion.div>

                <div className="grid grid-3" style={{ marginTop: '5rem' }}>
                    {[
                        { icon: <ShieldCheck color="#2563eb" />, title: "Secure Data", desc: "Your medical data is encrypted and never shared." },
                        { icon: <Zap color="#2563eb" />, title: "Fast Analysis", desc: "Get real-time predictions in under 30 seconds." },
                        { icon: <HeartPulse color="#2563eb" />, title: "Proactive Care", desc: "Early warnings and actionable next steps." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="glass"
                            style={{ padding: '2rem', textAlign: 'left' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                        >
                            <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
