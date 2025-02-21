import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
import cv2
import os

app = Flask(__name__)

# Load the trained model
MODEL_PATH = "C:\\Users\\piyus\\Desktop\\models\\tb_pnemo.h5"  # Change this to your model file
model = tf.keras.models.load_model(MODEL_PATH)

# Class labels (update according to your dataset)
class_labels = ["Normal", "Pneumonia", "Tuberculosis", "Not an X-ray"]

# Function to preprocess the image
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (256, 256))  # Resize to match model input
    img = np.expand_dims(img, axis=0) / 255.0  # Normalize
    return img

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded file
    file_path = "uploaded_image.jpg"
    file.save(file_path)

    # Preprocess and predict
    img = preprocess_image(file_path)
    predictions = model.predict(img)
    predicted_class = np.argmax(predictions)

    # Cleanup: Remove the saved file
    os.remove(file_path)

    # Return response
    return jsonify({
        "prediction": class_labels[predicted_class],
        "confidence": float(predictions[0][predicted_class])
    })

if __name__ == "__main__":
    app.run(debug=True)
