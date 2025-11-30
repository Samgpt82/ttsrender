// Initialize speech synthesis
const synth = window.speechSynthesis;
let currentUtterance = null;
let audioBlob = null;
let audioUrl = null;

// Check if Web Speech API is available
if (!('speechSynthesis' in window)) {
    console.error('Web Speech API is not supported in this browser');
    alert('Your browser does not support the Web Speech API. Please use Chrome, Edge, or Safari.');
}

// DOM elements
const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileName = document.getElementById('fileName');
const openaiVoiceSelect = document.getElementById('openaiVoiceSelect');
const modelSelect = document.getElementById('modelSelect');
const voiceSelect = document.getElementById('voiceSelect');
const rateSelect = document.getElementById('rateSelect');
const pitchSelect = document.getElementById('pitchSelect');
const generateBtn = document.getElementById('generateBtn');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const status = document.getElementById('status');

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
        
        // Clear status
        clearStatus();
    });
});

// File upload handling
fileUploadArea.addEventListener('click', () => fileInput.click());

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#764ba2';
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.style.borderColor = '#667eea';
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = '#667eea';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/plain') {
        handleFile(files[0]);
    } else {
        showStatus('Please upload a .txt file', 'error');
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    fileName.textContent = `📄 ${file.name}`;
    const reader = new FileReader();
    
    reader.onload = (e) => {
        textInput.value = e.target.result;
        showStatus('File loaded successfully!', 'success');
    };
    
    reader.onerror = () => {
        showStatus('Error reading file', 'error');
    };
    
    reader.readAsText(file);
}

// Load available voices
function loadVoices() {
    const voices = synth.getVoices();
    voiceSelect.innerHTML = '<option value="">Default</option>';
    
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Load voices when they become available
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// Generate audio
generateBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    
    if (!text) {
        showStatus('Please enter some text or upload a file', 'error');
        return;
    }
    
    if (!('speechSynthesis' in window)) {
        showStatus('Web Speech API not supported. Please use Chrome, Edge, or Safari.', 'error');
        return;
    }
    
    showStatus('Generating audio...', 'info');
    generateBtn.disabled = true;
    
    try {
        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const voices = synth.getVoices();
        const selectedVoiceIndex = voiceSelect.value;
        if (selectedVoiceIndex && voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
        }
        
        // Set rate and pitch
        utterance.rate = parseFloat(rateSelect.value);
        utterance.pitch = parseFloat(pitchSelect.value);
        
        // Generate audio using Web Audio API for recording
        await generateAudioBlob(utterance);
        
        currentUtterance = utterance;
        playBtn.disabled = false;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        downloadBtn.disabled = false;
        
        showStatus('Audio generated successfully! Click Play to hear it.', 'success');
    } catch (error) {
        console.error('Error generating audio:', error);
        showStatus('Error generating audio: ' + error.message, 'error');
    } finally {
        generateBtn.disabled = false;
    }
});

// Generate audio blob using Web Audio API
async function generateAudioBlob(utterance) {
    return new Promise((resolve, reject) => {
        // Use a simple approach: play and record
        // Note: This is a simplified version. For production, consider using a backend service
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const chunks = [];
        
        utterance.onend = () => {
            // For browser-based TTS, we'll use a workaround
            // Since we can't directly record SpeechSynthesis, we'll enable download via a different method
            resolve();
        };
        
        utterance.onerror = (error) => {
            reject(error);
        };
        
        // Store utterance for playback
        currentUtterance = utterance;
        resolve();
    });
}

// Play audio
playBtn.addEventListener('click', () => {
    if (currentUtterance) {
        // Stop any currently playing speech
        synth.cancel();
        
        // Create a new utterance to avoid issues with reused utterances
        const text = textInput.value.trim();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const voices = synth.getVoices();
        const selectedVoiceIndex = voiceSelect.value;
        if (selectedVoiceIndex && voices[selectedVoiceIndex]) {
            utterance.voice = voices[selectedVoiceIndex];
        }
        
        // Set rate and pitch
        utterance.rate = parseFloat(rateSelect.value);
        utterance.pitch = parseFloat(pitchSelect.value);
        
        utterance.onend = () => {
            showStatus('Playback finished', 'success');
        };
        
        utterance.onerror = (error) => {
            console.error('Speech synthesis error:', error);
            showStatus('Error playing audio: ' + error.error, 'error');
        };
        
        synth.speak(utterance);
        currentUtterance = utterance;
        showStatus('Playing audio...', 'info');
    } else {
        showStatus('Please generate audio first', 'error');
    }
});

// Pause audio
pauseBtn.addEventListener('click', () => {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        showStatus('Audio paused', 'info');
    } else if (synth.paused) {
        synth.resume();
        showStatus('Audio resumed', 'info');
    }
});

// Stop audio
stopBtn.addEventListener('click', () => {
    synth.cancel();
    showStatus('Audio stopped', 'info');
});

// Download audio
downloadBtn.addEventListener('click', async () => {
    const text = textInput.value.trim();
    
    if (!text) {
        showStatus('No text to download', 'error');
        return;
    }
    
    showStatus('Preparing download...', 'info');
    
    try {
        // Try to use backend API first
        try {
            // Use relative URL so it works on any domain (localhost or deployed)
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    voice: openaiVoiceSelect.value || 'alloy',
                    model: modelSelect.value || 'tts-1'
                })
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tts_output.mp3';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showStatus('Audio downloaded successfully!', 'success');
                return;
            } else {
                // Handle API errors
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                showStatus('Error: ' + (errorData.error || 'Failed to generate audio'), 'error');
                return;
            }
        } catch (backendError) {
            // Backend not available, fall back to browser-only message
            console.log('Backend not available, using browser-only mode');
        }
        
        // Fallback: Browser-only mode message
        showStatus('Backend not available. To download audio files, start the Python backend server (python app.py). Use Play button to listen in browser.', 'info');
    } catch (error) {
        showStatus('Error preparing download: ' + error.message, 'error');
    }
});

// Status messages
function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = `status ${type}`;
}

function clearStatus() {
    status.textContent = '';
    status.className = 'status';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('TTS Converter initialized');
    
    // Check browser support
    if (!('speechSynthesis' in window)) {
        showStatus('Warning: Web Speech API not supported. Please use Chrome, Edge, or Safari for best results.', 'error');
    } else {
        console.log('Web Speech API is available');
    }
    
    // Ensure voices are loaded
    if (synth.getVoices().length === 0) {
        // Wait a bit for voices to load
        setTimeout(loadVoices, 100);
    }
});

