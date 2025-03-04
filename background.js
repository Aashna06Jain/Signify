chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "captureAudio") {
        chrome.tabCapture.capture({ audio: true }, (stream) => {
            if (!stream) {
                console.error("❌ Failed to capture audio. Make sure the site allows audio capture.");
                sendResponse({ error: "Audio capture failed" });
                return;
            }

            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            let audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                const base64Audio = await convertBlobToBase64(audioBlob);
                sendResponse({ audio: base64Audio });
            };

            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), 5000); 
        });

        return true; 
    }
});

// Convert Blob to Base64
function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); // Extract Base64
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
