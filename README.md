# YouTube Video Downloader

A modern, full-stack YouTube video downloader application with a beautiful UI and robust backend structure.

## ⚠️ Important Legal Notice

This application is provided for educational purposes only. Please ensure you comply with:
- YouTube's Terms of Service
- Copyright laws in your jurisdiction
- Only download content you have rights to or that is in the public domain

## Features

- 🎥 Clean, modern video download interface
- 📱 Fully responsive design
- ⚡ Fast video processing and downloads
- 🎵 Multiple format support (MP4, MP3)
- 📊 Real-time download progress tracking
- 🔒 Safe and secure downloads

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Custom hooks for state management

### Backend
- Node.js with Express
- CORS enabled for cross-origin requests
- RESTful API structure

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server && npm install
```

### Development

1. Start the frontend development server:
```bash
npm run dev
```

2. Start the backend server (in a separate terminal):
```bash
cd server && npm run dev
```

## API Endpoints

- `POST /api/video-info` - Extract video information from YouTube URL
- `POST /api/download` - Download video in specified format and quality

## Implementation Notes

The current implementation includes:
- Complete frontend interface with mock data
- Backend API structure and endpoints
- TypeScript types and interfaces
- Responsive design components

For production use, you would need to:
1. Implement actual YouTube video extraction (consider ytdl-core or yt-dlp)
2. Add proper error handling and validation
3. Implement rate limiting and security measures
4. Consider hosting and legal compliance requirements

## Legal Considerations

- This tool should only be used for downloading content you have rights to
- Respect copyright laws and YouTube's Terms of Service
- Consider implementing user agreements and disclaimers
- Be aware that YouTube actively works to prevent unauthorized downloading

## Contributing

This is a demonstration project. For production use, please ensure all legal and technical requirements are properly addressed.

# YouTube Downloader Fullstack App

## Backend (Render Linux Hosting)

- Uses Express, spawns `yt-dlp` (Linux binary, installed via pip)
- CORS is configured for all Vercel subdomains and localhost
- To deploy on Render:
  1. Add `pip install -r server/requirements.txt` to your **Build Command** or **Start Command** in Render dashboard, before `npm install` or `node server/index.js`.
     - Example Build Command: `pip install -r server/requirements.txt && npm install && npm run build`
     - Example Start Command: `pip install -r server/requirements.txt && node server/index.js`
  2. Remove any `.exe` binaries from the repo (not needed for Linux)

## Frontend
- Vercel deploys from `main` branch
- API base URL points to your Render backend

## Notes
- If you see `EACCES` errors, make sure you are not referencing Windows `.exe` binaries and that `yt-dlp` is installed via pip.
- For local Windows dev, keep using `yt-dlp.exe` if needed, but for Render, always use the Linux binary.