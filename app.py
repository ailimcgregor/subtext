from flask import Flask, request, jsonify
from flask_cors import CORS
from main import get_audio_chunks, send_audio_chunks
from pydub import AudioSegment
import os
import asyncio

app = Flask(__name__)
CORS(app)

@app.route('/analyze_audio', methods=['POST'])
def analyze_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    api_key = os.getenv('HUME_API_KEY')
    
    audio_data = AudioSegment.from_file_using_temporary_files(audio_file)
    
    audio_chunks = list(get_audio_chunks(audio_data))
    
    # results = asyncio.run(send_audio_chunks(api_key, audio_chunks))
    
    # return jsonify(results)

    colors = asyncio.run(send_audio_chunks(api_key, audio_chunks))
    return colors

if __name__ == '__main__':
    app.run(debug=True)
