import base64
import math
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
          'Anger': '#b91c1c',
          'Contempt': '#b91c1c',
          'Distress': '#b91c1c',
          'Surprise (negative)': '#c026d3',
          'Fear': '#c026d3',
          'Anxiety': '#c026d3',
          'Horror': '#c026d3',
          'Confusion': '#854d0e',
          'Doubt': '#854d0e',
          'Craving': '#db2777',
          'Romance': '#db2777',
          'Desire': '#db2777',
          'Entrancement': '#db2777',
          'Love': '#db2777',
          'Adoration': '#db2777',
          'Awe': '#db2777',
          'Guilt': '#0284c7',
          'Shame': '#0284c7',
          'Embarassment': '#0284c7',
          'Sadness': '#1d4ed8',
          'Pain': '#1d4ed8',
          'Empathetic Pain': '#1d4ed8',
          'Disappointment': '#1d4ed8',
          'Nostalgia': '#1d4ed8',
          'Distress': '#1d4ed8',
          'Joy': '#facc15',
          'Ecstasy': '#facc15',
          'Excitement': '#facc15',
          'Surprise (positive)': '#facc15',
          'Pride': '#facc15',
          'Amusement': '#facc15',
          'Triumph': '#facc15',
          'Sympathy': '#38bdf8',
          'Satisfaction': '#38bdf8',
          'Aesthetic Appreciation': '#38bdf8',
          'Relief': '#38bdf8',
          'Disgust': '#22c55e',
          'Envy': '#22c55e',
          'Contempt': '#02801a'}


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
    # audio = AudioSegment.from_file(audio_file)
    audio = audio_file

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
        speech_segment = segment.low_pass_filter(5000)

        # Calculate the average volume level in decibels (dB)
        speech_volume = speech_segment.dBFS

        segment_volumes.append(speech_volume)

    return segment_volumes


def calculate_average_total_volume(audio_file):
    "average audio volume"
    # Load the audio file
    # audio = AudioSegment.from_file(audio_file)
    audio = audio_file

    # Extract just the speech portion (assuming it's in a certain range of frequencies)
    speech = audio.low_pass_filter(5000)

    # Calculate the average volume level in decibels (dB)
    speech_volume = speech.dBFS

    return speech_volume


def get_all_chunk_volumes(audio_file):
    avg_speech_volume = calculate_average_total_volume(audio_file)

    segment_length_ms = 3000
    segment_volumes = get_volume_of_each_segment(audio_file, segment_length_ms)

    volume_labels = []

    for volume in segment_volumes:
        print(volume)
        if ((volume > avg_speech_volume + 3) or (volume < -28.5)):
            volume_labels.append('small')
        elif ((volume < avg_speech_volume - 3) or (volume > -22.5)):
            volume_labels.append('large')
        else:
            volume_labels.append('regular')
    return volume_labels


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


def match_segments_to_chunks(segments, colors, volumes):
    matched_segments = {}
    segment_num = 0
    for segment in segments:
        start = segment['start']
        end = segment['end']
        first_chunk = math.floor(start/3)
        last_chunk = math.floor(end/3)
        mid_chunk = math.floor((first_chunk + last_chunk)/2)
        color = '#000000'
        volume = 'regular'
        if (mid_chunk > len(colors) - 1):
            color = colors[len(colors) - 1]
        else:
            color = colors[mid_chunk]
        if (mid_chunk > len(volumes) - 1):
            volume = volumes[len(volumes) - 1]
        else:
            volume = volumes[mid_chunk]
        matched_segments[segment_num] = {
            # add size later duhhhh
            'text': segment['text'], 'start': start, 'end': end, 'color': color, 'volume': volume}
        segment_num += 1
    return matched_segments
