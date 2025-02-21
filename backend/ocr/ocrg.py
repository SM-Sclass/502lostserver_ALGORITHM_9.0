from flask import Flask, request, jsonify
import os
import google.generativeai as genai
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = ''

# Configure the Gemini API key from the environment variable.
genai.configure(api_key="AIzaSyAzv_BWS77Ao4Le5cCsik8-CbNq5SmZYnY")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save the file securely in the UPLOAD_FOLDER
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file.filename))
    file.save(filepath)

    try:
        # Upload the file to Gemini
        sample_file = genai.upload_file(path=filepath)
    except Exception as e:
        os.remove(filepath)
        return jsonify({"error": f"Error uploading file: {str(e)}"}), 500

    os.remove(filepath)  # Clean up the saved file

    try:
        # Create a GenerativeModel instance and send the prompt along with the uploaded file
        model = genai.GenerativeModel(model_name="models/gemini-1.5-flash-8b")
        prompt = "OCR this document"
        response = model.generate_content([prompt, sample_file])
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": f"Error generating content: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
