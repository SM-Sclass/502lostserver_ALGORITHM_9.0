import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models  # Import ResNet models
from PIL import Image
from flask import Flask, request, jsonify
import io

# Initialize Flask app
app = Flask(__name__)

# Define model architecture (must match training)
class PneumoniaClassifier(nn.Module):
    def __init__(self, num_classes=4):
        super(PneumoniaClassifier, self).__init__()
        self.model = models.resnet18(pretrained=False)  # Load ResNet-18
        self.model.fc = nn.Linear(self.model.fc.in_features, num_classes)

    def forward(self, x):
        return self.model(x)

# Load the trained model
model = PneumoniaClassifier()
model.load_state_dict(torch.load("pneumonia_model (1).pth", map_location=torch.device("cpu")))

# model = PneumoniaClassifier()
# model.load_state_dict(torch.load("pneumonia_model.pth", map_location=torch.device("cpu")))
model.eval()

# Define image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def preprocess_image(image):
    image = Image.open(io.BytesIO(image)).convert("RGB")
    return transform(image).unsqueeze(0)

# API Endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image_tensor = preprocess_image(file.read())

    with torch.no_grad():
        output = model(image_tensor)
        prediction = torch.argmax(output, dim=1).item()

    labels = ["NORMAL", "PNEUMONIA", "UNKNOWN", "TUBERCULOSIS"]
    return jsonify({"prediction": labels[prediction]})

if __name__ == "__main__":
    app.run(debug=True)
