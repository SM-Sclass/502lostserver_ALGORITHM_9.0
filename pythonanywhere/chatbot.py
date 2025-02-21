from flask import Flask, request, jsonify
import os
import requests
import google.generativeai as genai
from werkzeug.utils import secure_filename
import sys
import locale

# Ensure UTF-8 encoding
sys.stdout.reconfigure(encoding='utf-8')
locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')

app = Flask(__name__)

# --- Gemini Chat Session Initialization ---
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
    "Act as a polite, empathetic, and professional chatbot for a medical website. Your purpose is to assist users with health-related queries, explain medical reports, and suggest possible causes and remedies for symptoms. Maintain a friendly yet concise tone, like chatting with a helpful assistant.\n\n"
    
    "Behavior Guidelines:\n"
    
    "Polite & Focused Communication:\n"
    "Respond to user queries politely and professionally.\n"
    "Keep responses short, precise, and easy to understand.\n"
    "If a user asks non-medical questions, politely redirect them:\n"
    "Example: \"I'm here to help with medical-related queries. Please ask about health or reports, and I'll assist you!\"\n\n"
    
    "Medical Report Analysis (OCR-based):\n"
    "When the user uploads a medical report, the extracted OCR text will be provided. Based on the content:\n"
    "- Analyze the report to give 4 short paragraphs without any title or heading each paragraph separated by a line. The 4 paragraphs are symptoms, diagnosis, prevention, Remedies.\n"
    "- Explain the report in simple language without complex medical terms.\n"
    "- Give a final verdict or review in short at last.\n"
    "Example: \"Your blood report shows slightly high cholesterol. This can often be managed with healthier eating and regular exercise. Would you like tips for that?\"\n\n"
    
    "Symptom-Based Guidance:\n"
    "For user-provided symptoms:\n"
    "- Suggest possible causes or conditions based on common medical knowledge.\n"
    "- If the condition seems mild, suggest home remedies, eating habits, and lifestyle changes.\n"
    "- If the condition seems serious, provide:\n"
    "  - Emergency steps to follow immediately.\n"
    "  - Information about nearby medical helplines, clinics, or hospitals.\n"
    "Example (Mild):\n"
    "User: \"I have a mild sore throat and headache.\"\n"
    "Bot: \"This could be due to a common cold. Try warm fluids, honey, and rest. If it persists, consult a doctor.\"\n\n"
    "Example (Serious):\n"
    "User: \"I’m having chest pain and shortness of breath.\"\n"
    "Bot: \"This could be serious. Please seek emergency medical help immediately. Should I find the nearest clinic for you?\"\n\n"
    
    "Response to Irrelevant Questions:\n"
    "If a user asks non-medical questions (e.g., \"Who won the football match?\"):\n"
    "Politely decline: \"I'm here to assist with medical queries. Please ask health-related questions for better assistance.\"\n\n"
    
    "Additional Instructions:\n"
    "1. If the user communicates in Hindi, respond in Hindi using the Devanagari script so that the output is also in Hindi when the user talks in Hindi.\n"
    "2. Always provide a diagnosis in your responses. Do not state that you are not suitable for diagnosis; instead, include a diagnosis and try to do as much as possible on your own and advise the user to consult a doctor if the situation worsens. Provide or ask before providing the info of nearby medical institutions or doctors when you suggest doctor consultation.\n"
    "3. Ensure that the response in any situation is short and precise. For example, when analyzing report data, focus only on the most relevant abnormalities (e.g., if RBC is not good, mention that along with the possible diseases) rather than explaining every data point.\n"
    "4. Avoid using any formatting such as bold or italics. Only use new lines to separate information, preventing text from being enclosed in special characters.\n"
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
    # Save the response to a UTF-8 encoded text file
    response = chat_session.send_message(user_text)
    response_text = response.text

    return response_text
    

# --- ElevenLabs TTS Integration ---
def text_to_speech_elevenlabs(text, output_filename="output.mp3"):
    """
    Converts text to speech using ElevenLabs API.
    Ensures UTF-8 encoding for Hindi and other non-English languages.
    """
    api_key = "sk_526a678e6085ef8721d2354d9377aba121da9a97d0937c66"
    voice_id = "2zRM7PkgwBPiau2jvVXc"

    if not api_key or not voice_id:
        raise Exception("ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set as environment variables.")
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "xi-api-key": api_key,
        "Content-Type": "application/json; charset=utf-8"  # Ensure UTF-8 encoding
    }

    # Ensure the text is properly encoded in UTF-8
    data = {
        "text": text.encode("utf-8").decode("utf-8"),  # Encode and decode to ensure UTF-8 compatibility
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.60,
            "similarity_boost": 0.60
        }
    }

    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        with open(output_filename, "wb") as f:
            f.write(response.content)
        print(f"MP3 file saved as {output_filename}")
        return output_filename
    else:
        raise Exception(f"ElevenLabs TTS API error: {response.status_code}, {response.text}")

# --- Flask Endpoint ---
@app.route('/chat', methods=['POST'])
def chat():
    # Expecting a JSON payload like: {"user_text": "Your question here"}
    data = request.get_json()
    if not data or "user_text" not in data:
        return jsonify({"error": "No user_text provided"}), 400

    user_text = data["user_text"]
    try:
        # Get text response from Gemini
        response_text = get_response(user_text)
    except Exception as e:
        return jsonify({"error": f"Gemini error: {str(e)}"}), 500

    # try:
    #     # Convert Gemini's text response to speech using ElevenLabs and save as "output.mp3" in the current folder.
    #     text_to_speech_elevenlabs(response_text, output_filename="output1.mp3")
    # except Exception as e:
    #     return jsonify({"error": f"TTS conversion failed: {str(e)}"}), 500

    # Return only the text response from Gemini
    return jsonify({
        "response_text": response_text
    })

# --- Run the Flask App ---
if __name__ == '__main__':
    # The host '0.0.0.0' allows access from any device on the same network.
    app.run(host='0.0.0.0', port=5000, debug=True)
