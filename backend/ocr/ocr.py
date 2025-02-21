from flask import Flask, request, jsonify
import os
import fitz  # PyMuPDF
import easyocr
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Function to extract text from an image using EasyOCR
def extract_text_from_image(image_path):
    reader = easyocr.Reader(['en'], gpu=True)
    result = reader.readtext(image_path)
    extracted_text = " ".join([detection[1] for detection in result])
    return extracted_text

# Function to extract text from a PDF using PyMuPDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    extracted_text = "".join([page.get_text("text") for page in doc])
    return extracted_text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join("uploads", filename)
    os.makedirs("uploads", exist_ok=True)
    file.save(file_path)

    # Process file based on its type
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        extracted_text = extract_text_from_image(file_path)
    elif filename.lower().endswith('.pdf'):
        extracted_text = extract_text_from_pdf(file_path)
    else:
        return jsonify({"error": "Unsupported file format. Please upload a PDF or image."}), 400

    # Return the extracted text as a response
    return jsonify({"response": extracted_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
