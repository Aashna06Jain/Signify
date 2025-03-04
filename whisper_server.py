from flask import Flask, request, jsonify
import numpy as np
import torch
import whisper
import wave
import base64
import io

app = Flask(__name__)
model = whisper.load_model("base")  

def decode_audio(base64_audio):
    audio_data = base64.b64decode(base64_audio)
    audio_io = io.BytesIO(audio_data)

    with wave.open(audio_io, "rb") as wf:
        sample_rate = wf.getframerate()
        num_frames = wf.getnframes()
        audio_np = np.frombuffer(wf.readframes(num_frames), dtype=np.int16).astype(np.float32) / 32768.0  

    return audio_np, sample_rate

@app.route("/transcribe", methods=["POST"])
def transcribe():
    try:
        data = request.json
        base64_audio = data.get("audio")

        if not base64_audio:
            return jsonify({"error": "No audio provided"}), 400

        audio_np, sample_rate = decode_audio(base64_audio)  
        result = model.transcribe(audio_np, fp16=torch.cuda.is_available())  

        return jsonify({"transcription": result["text"]})

    except Exception as e:
        print("❌ Whisper Server Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
