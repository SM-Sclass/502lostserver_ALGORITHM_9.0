from flask import Flask, request, jsonify
import os
import google.generativeai as genai

app = Flask(__name__)

# --- Chat Session Initialization ---

def initialize_chat_session():
    # Configure the Gemini API key (ideally use an environment variable)
    genai.configure(api_key="AIzaSyAzv_BWS77Ao4Le5cCsik8-CbNq5SmZYnY")
    
    # Define generation parameters for the model
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
    }
    
    # Create the GenerativeModel with the specified configuration
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash-8b",
        generation_config=generation_config,
    )
    
    # Start a chat session with an initial system prompt defining behavior
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    (
                        "Act as a polite, empathetic, and professional chatbot for a medical website. Your purpose is to assist users with health-related queries, explain medical reports, "
                        "and suggest possible causes and remedies for symptoms. Maintain a friendly yet concise tone, like chatting with a helpful assistant.\n\n"
                        "Behavior Guidelines:\n"
                        "Polite & Focused Communication:\n"
                        "Respond to user queries politely and professionally.\n"
                        "Keep responses short, precise, and easy to understand.\n"
                        "If a user asks non-medical questions, politely redirect them:\n"
                        "Example: \"I'm here to help with medical-related queries. Please ask about health or reports, and I'll assist you!\"\n\n"
                        "Medical Report Analysis (OCR-based):\n"
                        "When the user uploads a medical report, the extracted OCR text will be provided. Based on the content:\n\n"
                        "Analyze the report to identify diagnosis, key findings, and health indicators.\n"
                        "Explain the report in simple language without complex medical terms.\n"
                        "Highlight important points like abnormal values, potential issues, and next steps.\n"
                        "Example: \"Your blood report shows slightly high cholesterol. This can often be managed with healthier eating and regular exercise. Would you like tips for that?\"\n\n"
                        "Symptom-Based Guidance:\n"
                        "For user-provided symptoms:\n\n"
                        "Suggest possible causes or conditions based on common medical knowledge.\n"
                        "If the condition seems mild, suggest home remedies, eating habits, and lifestyle changes.\n"
                        "If the condition seems serious, provide:\n"
                        "Emergency steps to follow immediately.\n"
                        "Information about nearby medical helplines, clinics, or hospitals.\n"
                        "Example (Mild):\n"
                        "User: \"I have a mild sore throat and headache.\"\n"
                        "Bot: \"This could be due to a common cold. Try warm fluids, honey, and rest. If it persists, consult a doctor.\"\n\n"
                        "Example (Serious):\n"
                        "User: \"I’m having chest pain and shortness of breath.\"\n"
                        "Bot: \"This could be serious. Please seek emergency medical help immediately. Should I find the nearest clinic for you?\"\n\n"
                        "Response to Irrelevant Questions:\n"
                        "If a user asks non-medical questions (e.g., \"Who won the football match?\"):\n"
                        "Politely decline: \"I'm here to assist with medical queries. Please ask health-related questions for better assistance.\"\n"
                    )
                ],
            },
            {
                "role": "model",
                "parts": [
                    (
                        "Okay, I'm ready to be your helpful medical assistant! I will strive to be polite, empathetic, and professional in all my responses. "
                        "I will focus on providing clear and concise information related to health queries, medical report explanations, and symptom-based guidance, "
                        "while always remembering my limitations and suggesting professional medical advice when necessary. I will politely redirect non-medical questions. "
                        "Let's get started! How can I help you today?"
                    )
                ],
            },
        ]
    )
    return chat_session

# Initialize the chat session once when the app starts
chat_session = initialize_chat_session()

def get_response(user_text):
    """
    Sends the provided text message to the Gemini chatbot session and returns the response text.
    """
    response = chat_session.send_message(user_text)
    return response.text

# --- Flask Endpoint ---

@app.route('/chat', methods=['POST'])
def chat():
    # Expecting a JSON payload like: {"user_text": "Your question here"}
    data = request.get_json()
    if not data or "user_text" not in data:
        return jsonify({"error": "No user_text provided"}), 400

    user_text = data["user_text"]
    try:
        response_text = get_response(user_text)
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Running the Flask App ---
if __name__ == '__main__':
    # The host '0.0.0.0' allows access from any device on the same network
    app.run(host='0.0.0.0', port=5000, debug=True)
