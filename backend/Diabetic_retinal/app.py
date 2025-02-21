import tensorflow as tf
from tensorflow.keras.applications import EfficientNetB3
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.models import Sequential
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from PIL import Image
import io

# Recreate the model architecture
base_model = EfficientNetB3(include_top=False, input_shape=(224, 224, 3), pooling='avg')

model = Sequential([
    base_model,
    Dropout(0.5),
    Flatten(),
    Dense(512, activation='relu'),
    Dense(256, activation='relu'),
    Dense(128, activation='relu'),
    Dense(5, activation='softmax')  # 5 classes: No DR, Mild, Moderate, Severe, Proliferative DR
])

# Load the weights
model.load_weights("C:\\Users\\piyus\\Desktop\\models\\diabetic_model_complete.h5")

# Define ImageDataGenerator for preprocessing
prediction_datagen = ImageDataGenerator(
    zca_whitening=True,
    rotation_range=30,
    fill_mode='nearest'
)

# Define class names
class_names = ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative DR']

# Initialize Flask app
app = Flask(__name__)

def preprocess_image(image, target_size=(224, 224)):
    """Preprocess an image for model prediction."""
    img = image.convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Model expects a batch
    img_array = img_array / 255.0  # Normalize
    return next(prediction_datagen.flow(img_array, batch_size=1))

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image upload and return prediction."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    image = Image.open(io.BytesIO(file.read()))
    
    # Preprocess and predict
    processed_img = preprocess_image(image)
    prediction = model.predict(processed_img)
    predicted_class = np.argmax(prediction, axis=1)[0]
    
    return jsonify({'prediction': class_names[predicted_class]})

if __name__ == '__main__':
    app.run(debug=True, port=5006)
