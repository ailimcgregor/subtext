import base64
from hume import HumeStreamClient
from hume.models.config import ProsodyConfig
from pydub import AudioSegment
from pytube import YouTube
import os
import openai
from typing import Final
from dotenv import load_dotenv
from io import BytesIO

load_dotenv()
OPEN_API_TOKEN: Final[str] = os.getenv('OPEN_API_TOKEN')
openai.api_key = OPEN_API_TOKEN


colors = {'Determination': '#000000',
          'Concentration': '#000000',
          'Tiredness': '#000000',
          'Boredom': '#000000',
          'Awkwardness': '#000000',
          'Contemplation': '#000000',
          'Interest': '#000000',
          'Realization': '#000000',
          'Calmness': '#000000',
          'Anger': '#9a0503',
          'Contempt': '#9a0503',
          'Distress': '#9a0503',
          'Surprise (negative)': '#8939a7',
          'Fear': '#8939a7',
          'Anxiety': '#8939a7',
          'Horror': '#8939a7',
          'Confusion': '#c17d54',
          'Doubt': '#c17d54',
          'Craving': '#ffb1e2',
          'Romance': '#ffb1e2',
          'Desire': '#ffb1e2',
          'Entrancement': '#ffb1e2',
          'Love': '#ffb1e2',
          'Adoration': '#ffb1e2',
          'Awe': '#ffb1e2',
          'Guilt': '#0e5879',
          'Shame': '#0e5879',
          'Embarassment': '#0e5879',
          'Sadness': '#2e1cac',
          'Pain': '#2e1cac',
          'Empathetic Pain': '#2e1cac',
          'Disappointment': '#2e1cac',
          'Nostalgia': '#2e1cac',
          'Distress': '#2e1cac',
          'Joy': '#ffdb1e',
          'Ecstasy': '#ffdb1e',
          'Excitement': '#ffdb1e',
          'Surprise (positive)': '#ffdb1e',
          'Pride': '#ffdb1e',
          'Amusement': '#ffdb1e',
          'Triumph': '#ffdb1e',
          'Sympathy': '#9ecdff',
          'Satisfaction': '#9ecdff',
          'Aesthetic Appreciation': '#9ecdff',
          'Relief': '#9ecdff',
          'Disgust': '#6b8338',
          'Envy': '#6b8338',
          'Contempt': '#6b8338'}


def get_all_audio_segments(input_file_name):
    # openai.OpenAI() below?

    transcript = openai.audio.transcriptions.create(
        file=input_file_name,
        model="whisper-1",
        response_format="verbose_json",
        timestamp_granularities=["segment"]
    )
    return transcript.segments


def get_volume_of_each_segment(audio_file, segment_length_ms):
    # Load the audio file
    audio = AudioSegment.from_file(audio_file)

    # Calculate the total number of segments
    num_segments = len(audio) // segment_length_ms

    # Initialize a list to store the speech volumes of each segment
    segment_volumes = []

    # Iterate over the audio and segment it
    for i in range(num_segments):
        start_time = i * segment_length_ms
        end_time = (i + 1) * segment_length_ms
        segment = audio[start_time:end_time]

        # Extract just the speech portion (assuming it's in a certain range of frequencies)
        speech_segment = segment.low_pass_filter(3000)

        # Calculate the average volume level in decibels (dB)
        speech_volume = speech_segment.dBFS

        segment_volumes.append(speech_volume)

    return segment_volumes


def calculate_average_total_volume(audio_file):
    "average audio volume"
    # Load the audio file
    audio = AudioSegment.from_file(audio_file)

    # Extract just the speech portion (assuming it's in a certain range of frequencies)
    speech = audio.low_pass_filter(3000)

    # Calculate the average volume level in decibels (dB)
    speech_volume = speech.dBFS

    return speech_volume


def get_all_chunk_volumes(audio_file):
    avg_speech_volume = calculate_average_total_volume(audio_file)
    # print("Avg file Speech volume (dB):", avg_speech_volume)

    # Length of each segment in milliseconds (adjust as needed)
    segment_length_ms = 5000
    segment_volumes = get_volume_of_each_segment(audio_file, segment_length_ms)
    # print("Speech volumes of each segment (dB):", segment_volumes)

    # TODO: USE SEGMENT VOLUMES AND AVERAGE SPEECH VOLUMES TO CREATE A LIST OF CHUNKS AS SMALL NORMAL OR LARGE


def get_chunk_color(first_emotion, second_emotion, third_emotion):
    first_color = colors.get(first_emotion)
    second_color = colors.get(second_emotion)
    third_color = colors.get(third_emotion)

    # processing 'error' emotions into the 'unknown' color
    if (first_color is None):
        first_color = 'Unknown'
    if (second_color is None):
        second_color = 'Unknown'
    if (third_color is None):
        third_color = 'Unknown'

    # essentially assigning 3 points to the first color, 2 to the second, and 1 to the third and tie breaking with 2 and 3
    color = 'Unknown'

    if (first_color == second_color):
        color = first_color
        if (color == 'Unknown'):
            color = third_color
    elif (first_color == third_color):
        color = first_color
        if (color == 'Unknown'):
            color = second_color
    elif (second_color != third_color):
        color = first_color
    else:
        color = second_color
        if (color == 'Unknown'):
            color = first_color

    if (color == 'Unknown'):
        color = '#000000'

    return color


def get_all_audio_chunks(audio, chunk_length_ms=5000):
    for i in range(0, len(audio), chunk_length_ms):
        yield audio[i:i+chunk_length_ms]


async def get_all_chunk_colors(api_key, audio_chunks):
    client = HumeStreamClient(api_key)
    config = ProsodyConfig()
    emotions = []
    colors = []

    async with client.connect([config]) as socket:
        for chunk in audio_chunks:
            chunk_bytes = chunk.export(format="mp3", parameters=[
                                       "-acodec", "mp3"], bitrate="128k")
            encoded_chunk = base64.b64encode(chunk_bytes.read())

            result = await socket.send_bytes(encoded_chunk)
            emotions_subset = result['prosody']['predictions'][0]['emotions']
            sorted_emotions_subset = sorted(
                emotions_subset, key=lambda x: x['score'], reverse=True)
            first_emotion = sorted_emotions_subset[0]['name']
            second_emotion = sorted_emotions_subset[1]['name']
            third_emotion = sorted_emotions_subset[2]['name']
            color = get_chunk_color(
                first_emotion, second_emotion, third_emotion)
            colors.append(color)

            emotions.append(sorted_emotions_subset)

    return colors
