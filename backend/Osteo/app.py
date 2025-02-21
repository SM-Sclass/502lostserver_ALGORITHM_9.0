import pickle
from flask import Flask, request, jsonify
import numpy as np
import warnings
from sklearn.tree import DecisionTreeClassifier

# Suppress sklearn version warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)



# Load the model safely
def load_model():
    try:
        with open('model.pkl', 'rb') as model_file:
            return pickle.load(model_file)
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        # Create a new model if loading fails
        return DecisionTreeClassifier()

classifier = load_model()

@app.route('/')
def home():
    return "Osteoporosis Prediction API is running!"

# @app.route('/predict', methods=['POST'])
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from the request
        features = [
            float(data.get('Age', 0)),
            float(data.get('SEX', 0)),
            float(data.get('Prob', 0)),
            float(data.get('INJURY', 0)),
            float(data.get('DRUG', 0))
        ]
        
        # Make prediction
        features_array = np.array([features])
        prediction = classifier.predict(features_array)
        
        # Return the prediction
        return jsonify({
            'status': 'success',
            'prediction': int(prediction[0]),
            'message': 'Risk level: High' if prediction[0] == 1 else 'Risk level: Low'
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5002)
