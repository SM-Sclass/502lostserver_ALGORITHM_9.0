from flask import Flask, request, jsonify
import os
import mne
import numpy as np
import matplotlib.pyplot as plt
import boto3
import tempfile
import uuid
from io import BytesIO
from scipy import stats
from joblib import load
from werkzeug.utils import secure_filename
import google.generativeai as genai

# Configure Gemini API key
genai.configure(api_key="AIzaSyAzv_BWS77Ao4Le5cCsik8-CbNq5SmZYnY")
app = Flask(__name__)

# Load trained model
model = load('trained_model.h5')

# AWS S3 Configuration
S3_BUCKET = os.getenv("S3_BUCKET")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
S3_REGION = os.getenv("S3_REGION")

s3 = boto3.client("s3", aws_access_key_id=S3_ACCESS_KEY, aws_secret_access_key=S3_SECRET_KEY, region_name=S3_REGION)

# Hardcoded responses for Healthy and Schizophrenia
CONDITIONS = {
    "Healthy": {
        "diagnosis": "Your brain activity appears normal with no significant irregularities, indicating healthy neural patterns. EEG signals show balanced waveforms across all frequency bands, with no signs of abnormal synchronization or desynchronization.",
        "symptoms": "No abnormal symptoms detected. The brain appears to be functioning optimally, with normal cognitive performance, attention span, and emotional stability. There are no indications of neurological disorders or mental health concerns.",
        "remedies": "To maintain healthy brain activity, engage in regular physical exercise, practice mindfulness or meditation, and ensure you get 7-9 hours of quality sleep each night. Regular social interaction and mental stimulation, such as reading, puzzles, or learning new skills, can further support cognitive health.",
        "diet": "Eat a balanced diet rich in brain-boosting nutrients. Focus on foods high in omega-3 fatty acids (such as salmon, walnuts, and flaxseeds), antioxidants (like berries and spinach), vitamins (particularly B-complex, D, and E), and minerals (such as magnesium and zinc). Stay hydrated and limit processed foods, sugar, and excessive caffeine."
    },
    "Schizophrenia": {
        "diagnosis": "Your EEG data indicates patterns associated with schizophrenia. These patterns may include abnormal oscillations, altered connectivity between brain regions, and disruptions in the balance of brain waves, particularly in the gamma and theta bands. Such irregularities can be linked to cognitive and perceptual disturbances.",
        "symptoms": "Possible symptoms include disorganized thinking, hallucinations (hearing or seeing things that are not there), delusions (false beliefs despite evidence to the contrary), social withdrawal, reduced emotional expression, and cognitive impairment affecting attention, memory, and decision-making.",
        "remedies": "It is essential to consult a neurologist or psychiatrist for a comprehensive evaluation and diagnosis. Treatment typically involves a combination of antipsychotic medications to manage symptoms, cognitive-behavioral therapy (CBT) to address thought patterns, and psychoeducation for both the individual and their family. Stress management techniques, such as mindfulness and structured daily routines, can also be beneficial.",
        "diet": "A nutritious diet can support brain health and overall well-being. Focus on antioxidant-rich foods (such as berries, leafy greens, and nuts), omega-3 fatty acids (found in fatty fish, flaxseeds, and chia seeds), whole grains, and lean proteins. Avoid excessive caffeine, alcohol, and processed foods, as they may exacerbate symptoms. Regular hydration and a well-balanced diet can also support medication effectiveness and mental clarity."
    }
}

def extract_features(file_path):
    """Extracts EEG features from the uploaded EDF file."""
    data = mne.io.read_raw_edf(file_path, preload=True)
    data.set_eeg_reference()
    data.filter(l_freq=0.5, h_freq=45)

    epochs = mne.make_fixed_length_epochs(data, duration=5, overlap=1)
    epoch_data = epochs.get_data()

    # Feature extraction functions
    def mean(data): return np.mean(data, axis=-1)
    def std(data): return np.std(data, axis=-1)
    def ptp(data): return np.ptp(data, axis=-1)
    def var(data): return np.var(data, axis=-1)
    def minim(data): return np.min(data, axis=-1)
    def maxim(data): return np.max(data, axis=-1)
    def argminim(data): return np.argmin(data, axis=-1)
    def argmaxim(data): return np.argmax(data, axis=-1)
    def mean_square(data): return np.mean(data**2, axis=-1)
    def rms(data): return np.sqrt(np.mean(data**2, axis=-1))
    def abs_diffs_signal(data): return np.sum(np.abs(np.diff(data, axis=-1)), axis=-1)
    def skewness(data): return stats.skew(data, axis=-1)
    def kurtosis(data): return stats.kurtosis(data, axis=-1)

    # Concatenate extracted features
    features = np.concatenate((
        mean(epoch_data),
        std(epoch_data),
        ptp(epoch_data),
        var(epoch_data),
        minim(epoch_data),
        maxim(epoch_data),
        argminim(epoch_data),
        argmaxim(epoch_data),
        mean_square(epoch_data),
        rms(epoch_data),
        abs_diffs_signal(epoch_data),
        skewness(epoch_data),
        kurtosis(epoch_data)
    ), axis=-1)

    return features

def plot_eeg(file_path):
    """Generates EEG signal plot in memory and uploads to S3."""
    data = mne.io.read_raw_edf(file_path, preload=True)
    fig = data.plot(scalings='auto', show=False)

    # Save plot to in-memory BytesIO object
    img_buffer = BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)
    plt.close(fig)

    # Upload to S3 directly from memory
    s3_key = f"eeg_plots/{uuid.uuid4()}.png"
    s3.upload_fileobj(img_buffer, S3_BUCKET, s3_key, ExtraArgs={'ContentType': 'image/png'})

    # Generate public S3 link
    s3_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"
    return s3_url

def get_gemini_overview(graph_url):
    """
    Downloads the EEG graph from the S3 link and uploads it to the Gemini API for analysis.
    """
    try:
        # Download the image from the S3 URL
        response = requests.get(graph_url)
        if response.status_code != 200:
            return f"Failed to download image from {graph_url}"

        # Save the image temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_image:
            temp_image.write(response.content)
            temp_image_path = temp_image.name

        # Upload the local image to Gemini
        sample_file = genai.upload_file(path=temp_image_path)

        # Generate the overview
        model = genai.GenerativeModel(model_name="models/gemini-1.5-flash-8b")
        prompt = "Analyze this EEG graph and provide an overview regarding brain activity."
        response = model.generate_content([prompt, sample_file])

        # Clean up the temporary file
        os.remove(temp_image_path)

        return response.text if response and hasattr(response, 'text') else "No overview generated."

    except Exception as e:
        return f"Error generating overview: {str(e)}"

@app.route('/predict', methods=['POST'])

def predict():
    """Handles file upload, EEG analysis, graph generation, and prediction."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file and file.filename.endswith('.edf'):
        try:
            # Save the uploaded file to a temporary location
            with tempfile.NamedTemporaryFile(delete=False, suffix=".edf") as temp_file:
                file.save(temp_file.name)
                temp_file_path = temp_file.name

            # Extract features and predict
            features = extract_features(temp_file_path)
            prediction = model.predict(features)
            confidence = abs(model.decision_function(features)).max()

            # Determine label and generate graph
            label = "Healthy" if prediction[0] == 0 else "Schizophrenia"
            graph_url = plot_eeg(temp_file_path)
            overview = get_gemini_overview(graph_url)

            # Clean up the temporary file
            os.remove(temp_file_path)

            # Prepare the final response
            response = {
                "prediction": label,
                "confidence": round(confidence * 100, 2),
                "link": graph_url,
                "overview": overview,
                "diagnosis": CONDITIONS[label]["diagnosis"],
                "symptoms": CONDITIONS[label]["symptoms"],
                "remedies": CONDITIONS[label]["remedies"],
                "diet": CONDITIONS[label]["diet"]
            }
            return jsonify(response)

        except Exception as e:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            return jsonify({'error': str(e)})
    
    return jsonify({'error': 'Invalid file format. Please upload an .edf file.'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
