import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Activity, User, Info } from 'lucide-react';

const symptomsList = [
    'fever', 'cough', 'fatigue', 'shortness_of_breath',
    'headache', 'body_ache', 'sore_throat', 'loss_of_taste',
    'chest_pain', 'dizziness'
];

interface FormProps {
    onPredict: (data: any) => void;
    isLoading: boolean;
}

const PredictForm: React.FC<FormProps> = ({ onPredict, isLoading }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        symptoms: [] as string[],
        lifestyle_smoking: false,
        lifestyle_exercise: false,
        blood_pressure: '',
        sugar_level: ''
    });

    const handleSymptomToggle = (symptom: string) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPredict({
            ...formData,
            age: parseInt(formData.age || '25')
        });
    };

    return (
        <motion.div
            className="glass"
            style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ background: '#dbeafe', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Activity size={20} color="var(--primary)" />
                </div>
                <h2 style={{ fontSize: '1.5rem' }}>Health Assessment Form</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-2">
                    <div className="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            placeholder="e.g. 25"
                            value={formData.age}
                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Symptoms <Info size={14} />
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {symptomsList.map(symptom => (
                            <button
                                key={symptom}
                                type="button"
                                onClick={() => handleSymptomToggle(symptom)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.875rem',
                                    background: formData.symptoms.includes(symptom) ? 'var(--primary)' : 'white',
                                    color: formData.symptoms.includes(symptom) ? 'white' : 'var(--text-muted)',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                {symptom.replace(/_/g, ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-2" style={{ margin: '1.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            style={{ width: '1.25rem', height: '1.25rem' }}
                            checked={formData.lifestyle_smoking}
                            onChange={e => setFormData({ ...formData, lifestyle_smoking: e.target.checked })}
                        />
                        <label style={{ margin: 0 }}>Regular Smoker</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            style={{ width: '1.25rem', height: '1.25rem' }}
                            checked={formData.lifestyle_exercise}
                            onChange={e => setFormData({ ...formData, lifestyle_exercise: e.target.checked })}
                        />
                        <label style={{ margin: 0 }}>Regular Exercise</label>
                    </div>
                </div>

                <div className="grid grid-2">
                    <div className="form-group">
                        <label>Blood Pressure (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. 120/80"
                            value={formData.blood_pressure}
                            onChange={e => setFormData({ ...formData, blood_pressure: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Sugar Level (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. 95 mg/dL"
                            value={formData.sugar_level}
                            onChange={e => setFormData({ ...formData, sugar_level: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Analyzing...' : <><Send size={18} /> Predict Health Risks</>}
                </button>
            </form>
        </motion.div>
    );
};

export default PredictForm;
