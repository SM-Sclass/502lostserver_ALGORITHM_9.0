from flask import Flask, request, jsonify
import os
import pandas as pd
import numpy as np
import google.generativeai as genai
from sklearn.ensemble import RandomForestClassifier  
from sklearn.model_selection import train_test_split
from joblib import dump, load

# Configure Gemini API
genai.configure(api_key="AIzaSyAzv_BWS77Ao4Le5cCsik8-CbNq5SmZYnY")

# Load dataset
df = pd.read_csv('Dataset.csv')
df.drop(['SI.NO', 'DATE', 'NAME'], axis=1, inplace=True)

# Encode categorical data
df['SEX'] = df['SEX'].map({'Male': 1, 'Female': 0, 'female': 0, 'male': 1})
df['ASSO MEDICAL PROB'] = df['ASSO MEDICAL PROB'].map({
    'no': 0, 'No': 0, 'yes(diabetes)': 1, 'yes (diabetes)': 1, 'yes(bp)': 2, 'kidney stone': 3,
    'yes(increase in heart rate)': 4, 'Yes(Diabetes,bp)': 5, 'yes(bp dabetes)': 5,
    'yes(diabetes,bp)': 5, 'Yes(Diabetes,Blockage in Heart)': 6, 'yes (diabetes,heart blockage)': 6,
    'yes(diabetes,kidney stone)': 7
})
df['H/O INJURY/SURGERY'] = df['H/O INJURY/SURGERY'].map({
    'no': 0, 'vericose vein surgery': 1, 'uteres removal': 2, 'kidney stone opreration': 3,
    'uterus surgery': 4, 'yes(diverticulities)': 5, 'shouler surgery': 6, 'knee surgery': 7,
    'yes(open heart surgery)': 8
})
df['DRUG HISTORY'] = df['DRUG HISTORY'].map({'no': 0, 'yes': 1, 'yes(ecosprin)': 2})

# Train model
x = df.drop(['avg', 'FREQUENCY'], axis=1)
y = df['avg'].astype(int)
xtrain, xtest, ytrain, ytest = train_test_split(x, y, test_size=0.3, random_state=1)

classifier = RandomForestClassifier(n_estimators=10, criterion="entropy")
classifier.fit(xtrain, ytrain)

# Save the trained model
dump(classifier, 'bone_health_model.pkl')

# Load the trained model
model = load('bone_health_model.pkl')

# Flask app
app = Flask(__name__)

# Hardcoded conditions
CONDITIONS = {
    "Osteoporotic": {
        "diagnosis": "Osteoporosis is a condition where bones become weak and brittle, increasing fracture risk.",
        "symptoms": "Symptoms may include back pain, loss of height over time, and easily fractured bones.",
        "remedies": "Weight-bearing exercises, calcium and vitamin D supplements, and medication as prescribed.",
        "diet": "Consume calcium-rich foods (milk, yogurt, leafy greens) and vitamin D (salmon, fortified foods)."
    },
    "Osteopenia": {
        "diagnosis": "Osteopenia is a condition where bone density is lower than normal but not severe enough to be osteoporosis.",
        "symptoms": "Generally, no symptoms; however, it increases the risk of fractures in later stages.",
        "remedies": "Regular exercise, a calcium and vitamin-rich diet, and reducing alcohol/caffeine intake.",
        "diet": "Increase intake of dairy, fish, leafy greens, and nuts to strengthen bones."
    },
    "Normal": {
        "diagnosis": "Your bone density appears to be within the normal range with no major concerns.",
        "symptoms": "No abnormal symptoms detected.",
        "remedies": "Maintain a balanced diet, stay active, and avoid smoking and excessive alcohol.",
        "diet": "Continue a healthy diet with adequate calcium and vitamin D to support bone health."
    }
}

def give_pred(test):
    """Predicts bone health status."""
    prediction = model.predict(test)[0]
    if prediction > 100:
        return "Osteoporotic"
    elif 60 < prediction <= 100:
        return "Osteopenia"
    else:
        return "Normal"

def get_gemini_overview(inputs, prediction):
    """Generates an overview using the Gemini API."""
    try:
        model_gemini = genai.GenerativeModel(model_name="models/gemini-1.5-flash-8b")
        prompt = f"""
        Given the following patient inputs:
        - Age: {inputs['Age']}
        - Sex: {'Male' if inputs['SEX'] == 1 else 'Female'}
        - Associated Medical Problems: {inputs['Prob']}
        - History of Injury/Surgery: {inputs['INJURY']}
        - Drug History: {inputs['DRUG']}

        The predicted condition is: {prediction}.
        Provide a short and precise medical explanation about this prediction which is understandable by any user. Use No bold or any formatting, just one single paragraph.
        """
        response = model_gemini.generate_content(prompt)
        return response.text if response and hasattr(response, 'text') else "No overview generated."
    except Exception as e:
        return f"Error generating overview: {str(e)}"

@app.route('/predict', methods=['POST'])
def predict():
    """Handles prediction requests."""
    try:
        data = request.json
        required_fields = ['Age', 'SEX', 'Prob', 'INJURY', 'DRUG']

        # Validate inputs
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Convert inputs to the required format
        test = [[data['Age'], data['SEX'], data['Prob'], data['INJURY'], data['DRUG']]]
        
        # Make prediction
        prediction = give_pred(test)
        
        # Generate overview with Gemini
        overview = get_gemini_overview(data, prediction)

        # Prepare response
        response = {
            "prediction": prediction,
            "overview": overview,
            "diagnosis": CONDITIONS[prediction]["diagnosis"],
            "symptoms": CONDITIONS[prediction]["symptoms"],
            "remedies": CONDITIONS[prediction]["remedies"],
            "diet": CONDITIONS[prediction]["diet"]
        }
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
