import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def load_ml_model(model_path):
    try:
        # Custom object scope for BatchNormalization
        custom_objects = {
            'BatchNormalization': tf.keras.layers.BatchNormalization
        }
        
        model = load_model(model_path, custom_objects=custom_objects, compile=False)
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        print("Model loaded successfully!")
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None
def preprocess_image(image_path):
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")
            
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Failed to load image")
            
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'model1.h5')
    image_path = os.path.join(current_dir, 'testing', 'an.jpg')
    
    # Load model
    model = load_ml_model(model_path)
    if model is None:
        return
    
    # Preprocess image
    processed_image = preprocess_image(image_path)
    if processed_image is None:
        return
    
    try:
        # Perform prediction
        predictions = model.predict(processed_image, verbose=0)
        
        # Set threshold and print results
        threshold = 0.5
        probability = predictions[0][0]
        
        print(f"Prediction probability: {probability:.4f}")
        if probability > threshold:
            print("The image is classified as Anemic")
        else:
            print("The image is classified as Non-Anemic")
            
    except Exception as e:
        print(f"Error during prediction: {str(e)}")

if __name__ == "__main__":
    main()
