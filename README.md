# Text to Speech Converter

A simple web application that converts text or text files into audio using text-to-speech technology.

## Features

- ✨ Modern, responsive UI
- 📝 Type text directly or upload .txt files
- 🎤 Multiple OpenAI TTS voices (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- 🎯 Two model options: tts-1 (fast) and tts-1-hd (high quality)
- ⚡ Adjustable speed and pitch for browser playback
- 🔊 Play, pause, and stop controls
- 💾 Download high-quality MP3 audio files
- 🌐 Works entirely in browser (frontend-only mode for playback)

## Quick Start

### Option 1: Browser-Only (No Installation)

Simply open `index.html` in your web browser. This uses the Web Speech API and works entirely in the browser without any backend.

**Note:** Browser-based TTS cannot generate downloadable audio files. Use the Play button to listen to the audio.

### Option 2: With Python Backend (Recommended for Audio Downloads)

1. **Set your OpenAI API key:**
   
   **Windows (PowerShell):**
   ```powershell
   $env:OPENAI_API_KEY="your-api-key-here"
   ```
   
   **Windows (Command Prompt):**
   ```cmd
   set OPENAI_API_KEY=your-api-key-here
   ```
   
   **Linux/Mac:**
   ```bash
   export OPENAI_API_KEY="your-api-key-here"
   ```
   
   Or create a `.env` file (not recommended for production):
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask server:**
   ```bash
   python app.py
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

The backend uses OpenAI's TTS API which provides:
- High-quality audio generation with natural voices
- 6 different voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- Two model options: tts-1 (fast) and tts-1-hd (high quality)
- Downloadable MP3 files

## Usage

1. **Enter Text:**
   - Type your text in the text area, OR
   - Click "Upload File" and select a .txt file

2. **Customize (optional):**
   - Select an OpenAI voice for downloads (Alloy, Echo, Fable, Onyx, Nova, or Shimmer)
   - Choose model quality (tts-1 for speed, tts-1-hd for quality)
   - Select browser voice for playback
   - Adjust speed (0.5x to 2x) - browser playback only
   - Adjust pitch (Low to Very High) - browser playback only

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
   - **Add Environment Variable:**
     - Key: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
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
- **TTS Engine:** Web Speech API (browser playback) / OpenAI TTS API (audio downloads)
- **Deployment:** Gunicorn (WSGI server)

## OpenAI API Setup

This app requires an OpenAI API key for generating downloadable audio files. 

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Set it as an environment variable (see Quick Start section)
3. The API key is only used server-side and never exposed to the client

**Note:** OpenAI TTS API usage is billed per character. Check [OpenAI Pricing](https://openai.com/pricing) for current rates.

## License

MIT License - feel free to use and modify as needed!

