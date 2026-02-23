import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import numpy as np
import pickle
import os

class HealthPredictor:
    def __init__(self):
        self.model = None
        self.symptom_list = [
            'fever', 'cough', 'fatigue', 'shortness_of_breath', 
            'headache', 'body_ache', 'sore_throat', 'loss_of_taste', 
            'chest_pain', 'dizziness'
        ]
        self._initialize_dummy_model()

    def _initialize_dummy_model(self):
        # In a real scenario, this would load a pre-trained model.
        # For this MVP, we train a simple RF on synthetic data.
        
        # Features: age, gender (0=M, 1=F), smoking (0,1), exercise (0,1), + symptoms
        X = []
        y = []
        
        # Synthetic data generation for demonstration
        for _ in range(100):
            age = np.random.randint(18, 80)
            gender = np.random.randint(0, 2)
            smoking = np.random.randint(0, 2)
            exercise = np.random.randint(0, 2)
            symptoms = np.random.randint(0, 2, size=len(self.symptom_list))
            
            features = [age, gender, smoking, exercise] + list(symptoms)
            X.append(features)
            
            # Simple risk calculation for label
            risk_score = (age / 100) * 0.3 + (smoking * 0.2) - (exercise * 0.1) + (np.sum(symptoms) / 10) * 0.4
            if risk_score > 0.6:
                y.append(2) # High
            elif risk_score > 0.3:
                y.append(1) # Medium
            else:
                y.append(0) # Low

        self.model = RandomForestClassifier(n_estimators=10)
        self.model.fit(X, y)

    def predict(self, data):
        """
        data: dict containing age, gender, lifestyle, and symptoms
        """
        age = data.get('age', 25)
        gender = 1 if data.get('gender') == 'female' else 0
        smoking = 1 if data.get('lifestyle_smoking') else 0
        exercise = 1 if data.get('lifestyle_exercise') else 0
        
        symptom_vector = []
        for s in self.symptom_list:
            symptom_vector.append(1 if s in data.get('symptoms', []) else 0)
            
        features = [age, gender, smoking, exercise] + symptom_vector
        
        prediction = self.model.predict([features])[0]
        probabilities = self.model.predict_proba([features])[0]
        
        risk_levels = ["Low", "Medium", "High"]
        return {
            "prediction": risk_levels[prediction],
            "risk_score": float(np.max(probabilities) * 100),
            "probabilities": {risk_levels[i]: float(probabilities[i]) for i in range(len(risk_levels))}
        }

predictor = HealthPredictor()
