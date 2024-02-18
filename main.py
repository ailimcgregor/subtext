import base64
from hume import HumeStreamClient
from hume.models.config import ProsodyConfig

def get_audio_chunks(audio, chunk_length_ms=5000):
    for i in range(0, len(audio), chunk_length_ms):
        yield audio[i:i+chunk_length_ms]

async def send_audio_chunks(api_key, audio_chunks):
    client = HumeStreamClient(api_key)
    config = ProsodyConfig()
    results = []
    
    async with client.connect([config]) as socket:
        for chunk in audio_chunks:
            chunk_bytes = chunk.export(format="mp3", parameters=["-acodec", "mp3"], bitrate="128k")
            encoded_chunk = base64.b64encode(chunk_bytes.read())

            result = await socket.send_bytes(encoded_chunk)
            emotions_subset = result['prosody']['predictions'][0]['emotions']
            sorted_emotions_subset = sorted(emotions_subset, key=lambda x: x['score'], reverse=True)
            results.append(sorted_emotions_subset)

    return results
