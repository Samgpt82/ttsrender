from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import os
import tempfile
from openai import OpenAI
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize OpenAI client (will be None if API key not set)
def get_openai_client():
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        return None
    return OpenAI(api_key=api_key)

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/style.css')
def serve_css():
    return send_from_directory('.', 'style.css', mimetype='text/css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('.', 'script.js', mimetype='application/javascript')

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text', '').strip()
        voice = data.get('voice', 'alloy')  # Default to 'alloy'
        model = data.get('model', 'tts-1')  # Use tts-1 (faster) or tts-1-hd (higher quality)
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # Validate voice
        valid_voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']
        if voice not in valid_voices:
            voice = 'alloy'
        
        # Check if API key is set and get client
        openai_client = get_openai_client()
        if not openai_client:
            return jsonify({'error': 'OPENAI_API_KEY not configured. Please set the OPENAI_API_KEY environment variable.'}), 500
        
        # Generate speech using OpenAI TTS
        response = openai_client.audio.speech.create(
            model=model,
            voice=voice,
            input=text
        )
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        temp_file.close()
        
        # Save audio to file
        response.stream_to_file(temp_file.name)
        
        # Return the audio file
        return send_file(
            temp_file.name,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='tts_output.mp3'
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voices', methods=['GET'])
def get_voices():
    # Return available OpenAI TTS voices
    voices = {
        'alloy': 'Alloy - Neutral, balanced voice',
        'echo': 'Echo - Clear, confident voice',
        'fable': 'Fable - Warm, expressive voice',
        'onyx': 'Onyx - Deep, authoritative voice',
        'nova': 'Nova - Bright, energetic voice',
        'shimmer': 'Shimmer - Soft, gentle voice'
    }
    return jsonify(voices)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

