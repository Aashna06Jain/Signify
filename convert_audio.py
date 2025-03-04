import base64

def encode_audio(file_path):
    with open(file_path, "rb") as audio_file:
        return base64.b64encode(audio_file.read()).decode("utf-8")


base64_audio = encode_audio("example.wav")


with open("base64_audio.txt", "w") as f:
    f.write(base64_audio)

print("✅ Base64 Audio Saved in base64_audio.txt")
