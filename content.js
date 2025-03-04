let signVideo = null; 

function addSignLanguageVideo() {
    if (signVideo) return; 

    signVideo = document.createElement("video");
    signVideo.src = chrome.runtime.getURL("assets/video1.mp4");
    signVideo.style.position = "fixed";
    signVideo.style.bottom = "10px";
    signVideo.style.right = "10px";
    signVideo.style.width = "200px";
    signVideo.style.border = "2px solid black";
    signVideo.style.borderRadius = "10px";
    signVideo.autoplay = false;
    signVideo.muted = true;
    signVideo.loop = false;
    signVideo.controls = true;
    signVideo.style.cursor = "grab";

    document.body.appendChild(signVideo);
    console.log("🎉 Sign language video added!");

    makeVideoDraggable(signVideo);
}

function makeVideoDraggable(video) {
    let offsetX, offsetY, isDragging = false;

    video.addEventListener("mousedown", (e) => {
        offsetX = e.clientX - video.getBoundingClientRect().left;
        offsetY = e.clientY - video.getBoundingClientRect().top;
        isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(window.innerWidth - video.clientWidth, newX));
        newY = Math.max(0, Math.min(window.innerHeight - video.clientHeight, newY));

        video.style.left = `${newX}px`;
        video.style.top = `${newY}px`;
        video.style.position = "fixed";
        
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        video.style.cursor = "grab";
    });
}

function removeSignLanguageVideo() {
    if (signVideo) {
        signVideo.remove();
        signVideo = null;
        console.log("❌ Sign language video removed!");
    }
}


setTimeout(() => {
    let videos = document.getElementsByTagName("video");

    
    if (videos.length === 0) {
        console.log("🔍 Checking for videos inside iframes...");

        const iframes = document.getElementsByTagName("iframe");
        for (let iframe of iframes) {
            try {
                let iframeVideos = iframe.contentDocument?.getElementsByTagName("video");
                if (iframeVideos?.length > 0) {
                    videos = iframeVideos;
                    break;
                }
            } catch (error) {
                console.warn("⚠️ Cannot access iframe due to security restrictions.");
            }
        }
    }

    if (videos.length > 0) {
        console.log("✅ Video detected on this page!");

        const mainVideo = videos[0];

        
        chrome.storage.sync.get("signEnabled", function (data) {
            if (data.signEnabled ?? true) {
                addSignLanguageVideo();
            }
        });

        
        mainVideo.addEventListener("play", () => {
            if (signVideo) {
                signVideo.play().catch(err => console.log("❌ Error playing sign language video: ", err));
            }
        });

        mainVideo.addEventListener("pause", () => {
            if (signVideo) signVideo.pause();
        });



        
        setInterval(() => {
            if (signVideo && Math.abs(mainVideo.currentTime - signVideo.currentTime) > 0.5) {
                signVideo.currentTime = mainVideo.currentTime;
            }
        }, 1000);

        
        mainVideo.addEventListener("ratechange", () => {
            if (signVideo) signVideo.playbackRate = mainVideo.playbackRate;
        });

        console.log("🔗 Sign language video is now synced with the main video.");

    } else {
        console.log("❌ No video detected on this page!");
    }
}, 3000);


chrome.runtime.onMessage.addListener((message) => {
    console.log("📩 Received toggle message:", message);
    if (message.action === "toggleSign") {
        if (message.enabled) {
            addSignLanguageVideo();
        } else {
            removeSignLanguageVideo();
        }
    }
});

function captureTabAudio(){
    chrome.runtime.sendMessage({ action: "captureAudio" }, (response) => {
        if (response && response.audio){
            sendAudioToWhisper(response.audio);
        } else{
            console.error("❌ Failed to capture audio. Make sure the site allows audio capture.");
        }
    });
}

async function captureAudioFromVideo(videoElement) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(videoElement);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.connect(audioContext.destination); // Play normally

        const mediaRecorder = new MediaRecorder(destination.stream, { mimeType: "audio/webm" });
        let audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const base64Audio = await convertBlobToBase64(audioBlob);
            sendAudioToWhisper(base64Audio);
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000); // Capture 5 seconds of audio

        console.log("🎙️ Audio capture started...");
    } catch (error) {
        console.error("❌ Error capturing audio:", error);
    }
}


function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]); 
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}


async function sendAudioToWhisper(base64Audio) {
    try {
        const response = await fetch("http://127.0.0.1:5001/transcribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audio: base64Audio })
        });

        const data = await response.json();
        console.log("📝 Transcribed Text:", data.transcription);
        displayTranscription(data.transcription);
    } catch (error) {
        console.error("❌ Error sending audio to Whisper:", error);
    }
}


function displayTranscription(text) {
    let transcriptDiv = document.getElementById("transcriptOverlay");

    if (!transcriptDiv) {
        transcriptDiv = document.createElement("div");
        transcriptDiv.id = "transcriptOverlay";
        transcriptDiv.style.position = "fixed";
        transcriptDiv.style.bottom = "10px";
        transcriptDiv.style.left = "10px";
        transcriptDiv.style.background = "rgba(0,0,0,0.8)";
        transcriptDiv.style.color = "white";
        transcriptDiv.style.padding = "10px";
        transcriptDiv.style.borderRadius = "5px";
        transcriptDiv.style.zIndex = "9999";
        document.body.appendChild(transcriptDiv);
    }

    transcriptDiv.textContent = text;
}


window.addEventListener("load", function () {
    const videos = document.getElementsByTagName("video");
    if (videos.length > 0) {
        console.log("✅ Video detected! Capturing audio...");
        captureAudioFromVideo(videos[0]);
    } else {
        console.log("❌ No video detected!");
    }
});

