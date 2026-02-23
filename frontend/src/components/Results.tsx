import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Download, RefreshCw, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import jsPDF from 'jspdf';

interface ResultsProps {
    data: {
        prediction: string;
        risk_score: float;
        probabilities: Record<string, number>;
        suggested_steps: string[];
        doctor_consult: string;
    };
    onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
    const chartData = Object.entries(data.probabilities).map(([name, value]) => ({
        name, value: value * 100
    }));

    const COLORS = {
        'Low': '#22c55e',
        'Medium': '#eab308',
        'High': '#ef4444'
    };

    const getRiskIcon = () => {
        if (data.prediction === 'Low') return <CheckCircle2 size={48} color="#22c55e" />;
        if (data.prediction === 'Medium') return <AlertTriangle size={48} color="#eab308" />;
        return <XCircle size={48} color="#ef4444" />;
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text('HealthPredict AI - Assessment Report', 20, 20);
        doc.setFontSize(14);
        doc.text(`Result: ${data.prediction} Risk (${data.risk_score.toFixed(1)}%)`, 20, 40);
        doc.text('Suggested Next Steps:', 20, 60);
        data.suggested_steps.forEach((step, i) => {
            doc.text(`- ${step}`, 25, 70 + (i * 10));
        });
        doc.text('Doctor Consultation:', 20, 110);
        doc.text(data.doctor_consult, 20, 120);
        doc.save('Health_Assessment_Report.pdf');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container"
            style={{ maxWidth: '1000px', paddingBottom: '5rem' }}
        >
            <div className="grid grid-2">
                <div className="glass" style={{ padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ marginBottom: '1rem' }}>{getRiskIcon()}</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{data.prediction} Risk</h2>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Risk Score: <span style={{ color: COLORS[data.prediction] }}>{data.risk_score.toFixed(1)}%</span>
                        </div>
                    </div>

                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Suggested Next Steps
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {data.suggested_steps.map((step, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                                    <div style={{ background: '#dbeafe', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <ArrowRight size={14} color="var(--primary)" />
                                    </div>
                                    <p style={{ fontSize: '0.95rem' }}>{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '2rem', borderLeft: `6px solid ${COLORS[data.prediction]}` }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Doctor Consultation</h3>
                        <p style={{ color: 'var(--text-muted)' }}>{data.doctor_consult}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" onClick={downloadPDF} style={{ flex: 1 }}>
                            <Download size={18} /> Download Report (PDF)
                        </button>
                        <button className="btn" onClick={onReset} style={{ border: '1px solid #e2e8f0', background: 'white' }}>
                            <RefreshCw size={18} /> Retake
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Results;
