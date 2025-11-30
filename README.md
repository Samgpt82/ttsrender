# Text to Speech Converter

A simple web application that converts text or text files into audio using text-to-speech technology.

## Features

- ✨ Modern, responsive UI
- 📝 Type text directly or upload .txt files
- 🎤 Multiple voice options (browser-based)
- ⚡ Adjustable speed and pitch
- 🔊 Play, pause, and stop controls
- 💾 Download audio files (with backend)
- 🌐 Works entirely in browser (frontend-only mode)

## Quick Start

### Option 1: Browser-Only (No Installation)

Simply open `index.html` in your web browser. This uses the Web Speech API and works entirely in the browser without any backend.

**Note:** Browser-based TTS cannot generate downloadable audio files. Use the Play button to listen to the audio.

### Option 2: With Python Backend (Recommended for Audio Downloads)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Flask server:**
   ```bash
   python app.py
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

The backend uses Google Text-to-Speech (gTTS) which provides:
- High-quality audio generation
- Multiple language support
- Downloadable MP3 files

## Usage

1. **Enter Text:**
   - Type your text in the text area, OR
   - Click "Upload File" and select a .txt file

2. **Customize (optional):**
   - Select a voice
   - Adjust speed (0.5x to 2x)
   - Adjust pitch (Low to Very High)

3. **Generate Audio:**
   - Click "Generate Audio"
   - Use Play/Pause/Stop to control playback
   - Click "Download Audio" to save the file (backend required)

## Browser Support

The Web Speech API is supported in:
- Chrome/Edge (full support)
- Safari (partial support)
- Firefox (limited support)

For best results, use Chrome or Edge.

## Deployment to Render

This app is ready to deploy to Render (or similar platforms like Railway, Heroku).

### Prerequisites
- A GitHub account
- A Render account (free tier available)

### Steps

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect it's a Python app
   - Settings:
     - **Name:** Your app name (e.g., "tts-converter")
     - **Environment:** Python 3
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn app:app`
   - Click "Create Web Service"
   - Wait for deployment (usually 2-3 minutes)

3. **Your app will be live at:**
   ```
   https://your-app-name.onrender.com
   ```

**Note:** The free tier on Render spins down after 15 minutes of inactivity. The first request after spin-down may take 30-60 seconds to respond.

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Python, Flask
- **TTS Engine:** Web Speech API (browser) / gTTS (backend)
- **Deployment:** Gunicorn (WSGI server)

## License

MIT License - feel free to use and modify as needed!

