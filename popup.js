document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById("toggleBtn");

    chrome.storage.sync.get("signEnabled", function(data){
        const isEnabled = data.signEnabled ?? true;
        toggleBtn.textContent = isEnabled ? "Disable Sign Language" : "Enable Sign Language";
    });

    toggleBtn.addEventListener("click", function() {
        chrome.storage.sync.get("signEnabled", function(data){
            const newState = !data.signEnabled;
            chrome.storage.sync.set({ signEnabled: newState });

            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "toggleSign", enabled: newState });
            });

            toggleBtn.textContent = newState ? "Disable Sign Language" : "Enable Sign Language";
        });
    });
})