from flask import Flask, request, jsonify
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)

# Load the trained model
model_path = 'C:\\Users\\piyus\\Desktop\\models\\anemia.h5'
custom_objects = {'BatchNormalization': tf.keras.layers.BatchNormalization}
model = load_model(model_path, custom_objects=custom_objects, compile=False)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

def preprocess_image(image):
    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    image = cv2.imdecode(np.fromstring(file.read(), np.uint8), 1)
    processed_image = preprocess_image(image)
    
    predictions = model.predict(processed_image)
    probability = predictions[0][0]
    
    if probability > 0.5:
        result = "Anemic"
    else:
        result = "Non-Anemic"
    
    return jsonify({'prediction': result, 'probability': float(probability)})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
