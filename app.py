from flask import Flask, request, jsonify
from flask_cors import CORS
from main import get_all_audio_chunks, get_all_chunk_colors, get_all_audio_segments, get_all_chunk_volumes
from pydub import AudioSegment
import os
import asyncio
import io

app = Flask(__name__)
CORS(app)

@app.route('/analyze_audio', methods=['POST'])
def analyze_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    buffer = audio_file.read()
    audio_file.seek(0)
    audio_bytes = io.BytesIO(buffer)
    audio_bytes.name = 'recording.m4a'
    audio_data = AudioSegment.from_file_using_temporary_files(audio_file)
    
    api_key = os.getenv('HUME_API_KEY')
    

    # emotion is chunked in second intervals
    # volume is chunked in second intervals
    # phrases are chunked by phrase, NOT by seconds

    audio_chunks_for_colors = list(get_all_audio_chunks(audio_data))
    colors = asyncio.run(get_all_chunk_colors(api_key, audio_chunks_for_colors))
    audio_phrase_segments = get_all_audio_segments(audio_bytes)

    print(audio_phrase_segments)

    print(colors)
    
    # results = asyncio.run(send_audio_chunks(api_key, audio_chunks))
    
    # return jsonify(results)


    return colors

if __name__ == '__main__':
    app.run(debug=True)
