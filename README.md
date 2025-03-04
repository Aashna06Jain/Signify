# Signify: AI-Powered Sign Language Translation for Online Videos

## 📌 Overview
**Signify** is a **browser extension** designed to enhance digital accessibility by providing **real-time sign language translation** for online videos. It captures audio from web videos, transcribes speech using **Whisper AI**, and synchronizes a **sign language avatar** that translates the spoken content into sign language. This empowers **deaf and hard-of-hearing users** to engage with video content without barriers.

## **🚀 Features**
✅ **AI-Powered Speech-to-Text:** Uses **Whisper AI** for accurate real-time transcription.  
✅ **Sign Language Interpretation:** Displays **pre-recorded or AI-generated avatars** for sign translation.  
✅ **Seamless Video Synchronization:** Ensures sign language video stays in sync with spoken content.  
✅ **Customizable UI:** Users can adjust **avatar size, speed, and position**.  
✅ **Lightweight & Non-Intrusive:** Works as a browser extension without affecting video playback.  
✅ **Multilingual Support (Future Scope):** Expanding to multiple languages & sign dialects.  

---

## **🛠️ Tech Stack**
- **Frontend:** JavaScript, HTML, CSS (Browser Extension UI)  
- **Backend:** Flask (Python) for AI-powered transcription  
- **AI Models:** OpenAI Whisper AI for speech-to-text conversion  
- **Sign Language Processing:** Pre-recorded videos or AI-based signing avatars  
- **Browser APIs:** Media Capture API, Web Audio API, Chrome Extensions API  

---

## **📌 How It Works**
### **1️⃣ Audio Extraction**  
🎙️ Captures video audio using **Web Audio API / Tab Capture API**.  

### **2️⃣ AI-Powered Transcription**  
📝 Converts speech to text using **Whisper AI** on a Flask server.  

### **3️⃣ Sign Language Translation**  
✋ Maps text to **sign language video database** or **AI avatars**.  

### **4️⃣ Video Synchronization**  
🎬 Syncs **sign language avatar with the original video playback**.  

---

## **⚙️ Installation & Setup**
### **🔹 Prerequisites**  
1. **Install Python 3.10+** and required dependencies:
   ```bash
   pip install flask openai-whisper numpy
   ```
2. **Install FFmpeg** (for audio processing):
   ```bash
   pip install imageio[ffmpeg]
   ```

### **🔹 Running the Whisper AI Server**
```bash
python whisper_server.py
```
✅ Server should now be running at **http://127.0.0.1:5001/**

### **🔹 Installing the Chrome Extension**
1. Go to `chrome://extensions/`  
2. Enable **Developer Mode** (top right corner)  
3. Click **Load Unpacked** → Select the `extension` folder  
4. Click on the extension icon & toggle **Signify ON**  

---

## **🚧 Challenges & Solutions**
| **Challenge**                 | **Solution** |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| Audio Capture Issues          | Used **Web Audio API** instead of `captureStream()` for reliable sound extraction. |
| API Limitations               | Optimized **transcription requests** to reduce latency. |
| Video Sync Issues             | Implemented **real-time timestamp mapping** to keep sign video in sync. |
| Browser Security Restrictions | Adjusted **permissions in `manifest.json`** for necessary API usage. |

---

## **🌍 Future Scope**
🔹 **AI-Generated Sign Language Avatars** for real-time signing  
🔹 **Multilingual Speech-to-Sign Translation**  
🔹 **Integration with Major Platforms** (YouTube, Netflix, etc.)  
🔹 **Mobile & Cross-Platform Support**  

---


## **📩 Contact & Contributions**
🙌 We welcome contributions! If you'd like to contribute, please submit a **Pull Request** or **open an Issue**.  
💬 For queries, reach out at: aashna06jain@gmail.com 

🚀 **Signify: Making the Digital World More Accessible!**  

