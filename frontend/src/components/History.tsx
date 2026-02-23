import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, ChevronRight, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

interface HistoryProps {
    userId: string;
}

const History: React.FC<HistoryProps> = ({ userId }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const { data } = await supabase
                .from('predictions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (data) {
                const formatted = data.map(item => ({
                    date: new Date(item.created_at).toLocaleDateString(),
                    risk: item.risk_score,
                    level: item.prediction_level
                }));
                setHistory(formatted);
            }
            setLoading(false);
        };

        if (userId) fetchHistory();
    }, [userId]);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>Loading health history...</div>;
    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.25rem' }}>Your Health Journey</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Track your risk assessment changes over time</p>
                </div>
                <div className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <TrendingUp color="var(--primary)" />
                    <span style={{ fontWeight: 600 }}>Trend: Increasing Risk</span>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
                <div className="glass" style={{ padding: '2rem', minHeight: '400px' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Risk Score Trend</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="risk"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: 'white', strokeWidth: 3, stroke: 'var(--primary)' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Recent Assessments</h3>
                    {history.slice().reverse().map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            className="glass"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                    <Calendar size={20} color="var(--text-muted)" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{item.level} Risk</p>
                                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{item.date}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className={`risk-tag risk-${item.level.toLowerCase()}`}>{item.risk}%</span>
                                <ChevronRight size={18} color="#cbd5e1" />
                            </div>
                        </motion.div>
                    ))}
                    <button className="btn" style={{ border: '2px dashed #cbd5e1', background: 'none', color: 'var(--text-muted)' }}>
                        <Activity size={18} /> Take New Assessment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default History;
