from flask import Flask, request, jsonify
import os
import mne
import numpy as np
from scipy import stats
from joblib import load
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Load trained model
model = load('trained_model.h5')


def extract_features(file_path):
    data = mne.io.read_raw_edf(file_path, preload=True)
    data.set_eeg_reference()
    data.filter(l_freq=0.5, h_freq=45)

    epochs = mne.make_fixed_length_epochs(data, duration=5, overlap=1)
    epoch_data = epochs.get_data()

    # Feature functions
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

    # Concatenate features
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

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file and file.filename.endswith('.edf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        try:
            features = extract_features(file_path)
            prediction = model.predict(features)
            label = 'Healthy' if prediction[0] == 0 else 'Schizophrenia'
            return jsonify({'prediction': label})
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            os.remove(file_path)
    
    return jsonify({'error': 'Invalid file format. Please upload an .edf file.'})
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
