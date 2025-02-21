from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

GEMINI_API_KEY = "AIzaSyDA74t7jWxCVoxb9tCGnO8l_qkenUoelRQ"
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        prompt = data.get("prompt")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }

        response = requests.post(f"{GEMINI_API_URL}?key={GEMINI_API_KEY}", json=payload, headers=headers)
        result = response.json()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
