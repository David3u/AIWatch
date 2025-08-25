const analyzeBtn = document.getElementById('analyzeBtn');
const contentDiv = document.getElementById('content');
const settingsBtn = document.getElementById('settingsBtn');
const body = document.body;

const applyTheme = (theme) => {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    }
};

settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

const analyzeVideo = async (videoId) => {
    contentDiv.innerHTML = `
        <p>Analyzing transcript, please wait...</p>
        <div class="loader"></div>
    `;

    try {
        console.log('Sending request to server with video ID:', videoId);
        const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_id: videoId }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response:', errorText);
            throw new Error(`Server returned an error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Analysis result:', result);
        displayResult(result);
    } catch (error) {
        console.error('Error analyzing transcript:', error);
        displayResult({ error: `Connection error: ${error.message}` });
    }
};

const displayResult = (result) => {
    let contentHTML = '';
    if (result.error) {
        contentHTML = `<p class="error">Error: ${result.error}</p>`;
    } else {
        const scorePercent = (result.ai_score * 100).toFixed(1);
        contentHTML = `
            <p>This transcript is likely <strong>${scorePercent}%</strong> AI-generated.</p>
            <div class="bar-container">
                <div class="bar" style="width: ${scorePercent}%;"></div>
            </div>
        `;
    }
    contentDiv.innerHTML = contentHTML;
};

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        if (activeTab.url && activeTab.url.includes("youtube.com/watch")) {
            analyzeBtn.addEventListener('click', () => {
                chrome.scripting.executeScript({
                    target: { tabId: activeTab.id },
                    function: getVideoIdFromPage,
                }).then((injectionResults) => {
                    const videoId = injectionResults[0].result;
                    console.log('Extracted video ID:', videoId);
                    if (videoId) {
                        analyzeVideo(videoId);
                    } else {
                        displayResult({ error: "Could not find Video ID on this page." });
                    }
                }).catch((error) => {
                    console.error('Error executing script:', error);
                    displayResult({ error: "Could not access the YouTube page. Please refresh and try again." });
                });
            });
        } else {
            contentDiv.innerHTML = `<p>Navigate to a YouTube video page to use this extension.</p>`;
            analyzeBtn.style.display = 'none'; 
        }
    });
});

const getVideoIdFromPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
};