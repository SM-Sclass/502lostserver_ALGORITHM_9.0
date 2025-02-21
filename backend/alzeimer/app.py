import cv2 as cv
import numpy as np
from tensorflow.keras.models import load_model

# Load the saved model
model = load_model("C:\\Users\\piyus\\Desktop\\models\\alzheimers_model.h5")

# Function to preprocess an image
def preprocess_image(image_path):
    image = cv.imread(image_path)
    if image is None:
        raise ValueError("Invalid image path")
    
    gray_image = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    resized_image = cv.resize(gray_image, (64, 64))
    normalized_image = resized_image / 255.0  # Normalize
    return np.expand_dims(normalized_image, axis=0)  # Reshape for model

# Load and predict on a new image
image_path = "test_image.jpg"  # Replace with actual path
image_data = preprocess_image(image_path)
prediction = model.predict(image_data)

# Display results
predicted_label = np.argmax(prediction)
print(f"Predicted Label: {predicted_label}")
