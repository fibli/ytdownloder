const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request from:', origin);
    // Allow requests with no origin (like curl, server-to-server, or preflight)
    if (!origin) return callback(null, true);
    // Allow localhost for dev
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    // Allow any Vercel deployment for this project (preview or production)
    if (/^https:\/\/ytdownloder(-[a-z0-9]+)?\.vercel\.app$/.test(origin)) return callback(null, true);
    // Allow your Render frontend (if needed)
    if (origin === 'https://ytdownloder-b4wg.onrender.com') return callback(null, true);
    // Otherwise, block
    callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to estimate file size
const estimateFileSize = (format) => {
  // Rough estimation based on bitrate and duration
  if (format.contentLength) {
    return parseInt(format.contentLength);
  }
  
  // Fallback estimation
  const bitrate = format.bitrate || 1000;
  const duration = 180; // Assume 3 minutes average
  return Math.floor((bitrate * duration) / 8 * 1024); // Convert to bytes
};

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'YouTube Downloader API Server' });
});

// Video info endpoint (yt-dlp)
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }
    // Validate YouTube URL (basic check)
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
    }
    // Call yt-dlp to get info in JSON
    const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
    const ytDlp = spawn(ytDlpPath, ['-j', url]);
    let data = '';
    let errorData = '';
    ytDlp.stdout.on('data', chunk => { data += chunk; });
    ytDlp.stderr.on('data', chunk => { errorData += chunk; });
    ytDlp.on('close', code => {
      if (code !== 0 || !data) {
        console.error('yt-dlp error:', errorData);
        return res.status(500).json({ success: false, message: 'Failed to fetch video information. Please check the URL and try again.' });
      }
      try {
        const info = JSON.parse(data);
        // Build videoInfo
        const videoInfo = {
          id: info.id,
          title: info.title,
          thumbnail: Array.isArray(info.thumbnails) && info.thumbnails.length > 0 ? info.thumbnails[info.thumbnails.length - 1].url : '',
          duration: info.duration ? new Date(info.duration * 1000).toISOString().substr(11, 8) : '',
          author: info.uploader,
          views: info.view_count ? info.view_count.toLocaleString() : '',
          uploadDate: info.upload_date,
          description: info.description,
          url: url
        };

        // All video formats (video+audio, video-only, audio-only) - filter duplicates
        const seen = new Set();
        const allFormats = (info.formats || [])
          .filter(f => f.ext.toLowerCase() !== 'webm') // Remove all WEBM formats
          .map(f => {
            // For video: show only resolution (e.g., 1920x1080)
            // For audio: show bitrate (e.g., 128 kbps)
            let actualQuality = '';
            if (f.vcodec !== 'none') {
              actualQuality = f.resolution || '';
            } else if (f.acodec !== 'none') {
              actualQuality = f.abr ? `${f.abr} kbps` : '';
            }
            // Always show file size in MB or GB
            let actualSize = '';
            let sizeBytes = f.filesize || f.filesize_approx || 0;
            if (sizeBytes >= 1024 * 1024 * 1024) {
              actualSize = (sizeBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
            } else if (sizeBytes >= 1024 * 1024) {
              actualSize = (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
            } else if (sizeBytes > 0) {
              actualSize = (sizeBytes / 1024).toFixed(2) + ' KB';
            } else {
              actualSize = '';
            }
            return {
              itag: f.format_id,
              quality: actualQuality,
              qualityLabel: actualQuality,
              format: f.ext,
              container: f.ext,
              size: actualSize,
              bitrate: f.tbr || f.abr || 0,
              fps: f.fps,
              hasVideo: f.vcodec !== 'none',
              hasAudio: f.acodec !== 'none',
              url: f.url,
              audioBitrate: f.abr || 0,
              sampleRate: f.asr || 44100
            };
          })
          .filter(f => {
            // Use a key of quality+format+fps to filter duplicates
            const key = `${f.qualityLabel}_${f.format}_${f.fps}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });

        // Group formats for frontend
        const videoFormats = allFormats.filter(f => f.hasVideo);
        let audioFormats = allFormats.filter(f => !f.hasVideo && f.hasAudio);
        // Set file type to MP3 for audio section, but keep actual quality
        audioFormats = audioFormats.map(f => ({
          ...f,
          format: 'mp3'
        }));

        res.json({ success: true, videoInfo, videoFormats, audioFormats });
      } catch (err) {
        console.error('Error parsing yt-dlp output:', err);
        res.status(500).json({ success: false, message: 'Failed to parse video information.' });
      }
    });
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch video information. Please check the URL and try again.' });
  }
});

// Download endpoint (yt-dlp)
app.post('/api/download', async (req, res) => {
  try {
    const { url, format } = req.body;
    if (!url || !format) {
      return res.status(400).json({ success: false, message: 'URL and format are required' });
    }
    // Validate YouTube URL (basic check)
    if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url)) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
    }
    // Set response headers for download
    const fileName = `download_${Date.now()}.${format.format === 'mp3' ? 'mp3' : 'mp4'}`;
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', format.format === 'mp3' ? 'audio/mpeg' : 'video/mp4');
    // Build yt-dlp args
    const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
    let args;
    if (!format.itag) {
      return res.status(400).json({ success: false, message: 'Missing format itag' });
    }
    if (format.format === 'mp3') {
      // Audio-only (mp3)
      args = ['-f', `${format.itag}`, '-x', '--audio-format', 'mp3', '-o', '-', url];
    } else if (format.hasVideo) {
      // Always use the selected video itag for video, merge with best audio (m4a only, to avoid webm audio)
      // This guarantees the downloaded video matches the selected quality and is always playable
      args = ['-f', `${format.itag}+bestaudio[ext=m4a]`, '-o', '-', url];
    } else {
      // Fallback: just use the selected itag
      args = ['-f', `${format.itag}`, '-o', '-', url];
    }
    const ytDlp = spawn(ytDlpPath, args);
    ytDlp.stdout.pipe(res);
    ytDlp.stderr.on('data', chunk => {
      // Optionally log errors
      // console.error('yt-dlp stderr:', chunk.toString());
    });
    ytDlp.on('error', err => {
      console.error('yt-dlp error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Download failed' });
      }
    });
    ytDlp.on('close', code => {
      if (code !== 0) {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Download failed. Please try again.' });
        }
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Download failed. Please try again.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});