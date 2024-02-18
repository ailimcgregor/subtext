from flask import Flask, request, jsonify
from flask_cors import CORS
from main import get_all_audio_chunks, get_all_chunk_colors, get_all_audio_segments, get_all_chunk_volumes, match_segments_to_chunks
from pydub import AudioSegment
import os
import io
import asyncio
from pytube import YouTube
import string

app = Flask(__name__)
CORS(app)


@app.route('/analyze_audio', methods=['POST'])
def analyze_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    # file2 = request.files['audio']
    buffer = audio_file.read()
    audio_file.seek(0)
    audio_bytes = io.BytesIO(buffer)
    audio_bytes.name = 'recording.m4a'
    audio_data = AudioSegment.from_file_using_temporary_files(audio_file)

    api_key = os.getenv('HUME_API_KEY')

    # emotion is chunked in second intervals
    # volume is chunked in second intervals
    # phrases are chunked by phrase, NOT by seconds

    api_key = os.getenv('HUME_API_KEY')
    audio_chunks_for_colors = list(get_all_audio_chunks(audio_data))
    colors = asyncio.run(get_all_chunk_colors(
        api_key, audio_chunks_for_colors))

    audio_phrase_segments = get_all_audio_segments(audio_bytes)
    print(audio_phrase_segments)
    print(colors)

    audio_chunk_volumes = get_all_chunk_volumes(audio_data)

    print(audio_chunk_volumes)

    matched_text = match_segments_to_chunks(
        audio_phrase_segments, colors, audio_chunk_volumes)  # add sizes

    return matched_text


@app.route('/analyze_youtube', methods=['POST'])
def analyze_youtube():
    # TODO: check the input

    video_url = request.json['url']

    yt = YouTube(video_url)

    video_title = yt.title.replace(" ", "_")

    valid_chars = "-_.() %s%s" % (string.ascii_letters, string.digits)
    sanitized_title = ''.join(c for c in video_title if c in valid_chars)

    sanitized_title = sanitized_title[:100]

    audio_stream = yt.streams.get_audio_only()

    filename = f'{sanitized_title}.mp3'
    audio_stream.download(filename=filename)

    audio_data = AudioSegment.from_file(filename)

    api_key = os.getenv('HUME_API_KEY')

    audio_chunks_for_colors = list(get_all_audio_chunks(audio_data))
    colors = asyncio.run(get_all_chunk_colors(
        api_key, audio_chunks_for_colors))

    with open(filename, 'rb') as audio_file:
        buffer = audio_file.read()
    audio_bytes = io.BytesIO(buffer)
    audio_bytes.name = os.path.basename(filename)
    audio_phrase_segments = get_all_audio_segments(audio_bytes)
    audio_chunk_volumes = get_all_chunk_volumes(audio_data)

    matched_text = match_segments_to_chunks(audio_phrase_segments, colors, audio_chunk_volumes)  # add sizes

    return matched_text


if __name__ == '__main__':
    app.run(debug=True)
