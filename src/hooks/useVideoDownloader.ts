
// Minimal SaveFilePickerOptions type for browser compatibility
type SaveFilePickerOptions = {
  suggestedName?: string;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
};
declare global {
  interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<unknown>;
  }
}

import { useState } from 'react';
import { VideoInfo, VideoFormat, AudioFormat, DownloadProgress, DownloadSettings } from '../types';
import axios, { AxiosError } from 'axios';

// Configure axios base URL for backend API
const api = axios.create({
  baseURL: 'https://ytdownloder-b4wg.onrender.com',
  timeout: 30000,
});

// Type for API error response
interface ApiErrorResponse {
  message?: string;
}

export const useVideoDownloader = () => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [videoFormats, setVideoFormats] = useState<VideoFormat[]>([]);
  const [audioFormats, setAudioFormats] = useState<AudioFormat[]>([]);
  // Multi-download: progress keyed by downloadId
  const [downloadProgresses, setDownloadProgresses] = useState<Record<string, DownloadProgress>>({});
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<DownloadSettings>({
    downloadPath: '',
    quality: 'highest',
    format: 'mp4',
    audioQuality: 'highest'
  });
  // Store the last curl command for UI display
  const [lastCurlCommand, setLastCurlCommand] = useState<string | null>(null);

  const extractVideoInfo = async (url: string): Promise<void> => {
    setAnalyzing(true);
    setError(null);
    setVideoInfo(null);
    setVideoFormats([]);
    setAudioFormats([]);
    
    try {
      const response = await api.post('/api/video-info', { url });
      
      if (response.data.success) {
        setVideoInfo(response.data.videoInfo);
        setVideoFormats(response.data.videoFormats);
        setAudioFormats(response.data.audioFormats);
      } else {
        setError(response.data.message || 'Failed to analyze video');
      }
    } catch (err: unknown) {
      console.error('Error extracting video info:', err);
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Failed to analyze video. Please check the URL and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Multi-download: downloadMedia now supports multiple concurrent downloads
  const downloadMedia = async (format: VideoFormat | AudioFormat): Promise<void> => {
    // Helper: Set and optionally copy a curl command for manual download after success
    const showCmdHelper = (url: string, filename: string) => {
      const cmd = `curl -L "${url}" -o "${filename}"`;
      setLastCurlCommand(cmd);
      // Optionally auto-copy to clipboard (uncomment if you want this always)
      // if (navigator.clipboard) {
      //   navigator.clipboard.writeText(cmd);
      // }
    };
    if (!videoInfo) return;
    setLoading(true);
    // Use a unique downloadId (e.g., title + itag + format)
    const extension = format.format === 'mp3' ? 'mp3' : 'mp4';
    const safeTitle = videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_');
    const downloadId = `${safeTitle}_${format.itag}_${extension}`;
    setDownloadProgresses(prev => ({
      ...prev,
      [downloadId]: {
        percentage: 0,
        speed: '0 MB/s',
        eta: 'Calculating...',
        downloaded: '0 MB',
        total: format.size
      }
    }));
    try {
      const response = await api.post('/api/download', {
        url: videoInfo.url,
        format: format,
        settings: settings
      }, {
        responseType: 'blob',
        timeout: 0, // Disable timeout for large downloads
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            const downloadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(2);
            const totalMB = (progressEvent.total / (1024 * 1024)).toFixed(2);
            // Speed and ETA calculation can be improved by tracking previous progress, but for now use 0
            setDownloadProgresses(prev => ({
              ...prev,
              [downloadId]: {
                percentage,
                speed: `0 MB/s`,
                eta: 'Calculating...',
                downloaded: `${downloadedMB} MB`,
                total: `${totalMB} MB`
              }
            }));
          }
        }
      });
      // Create download link using the File System Access API if available, otherwise fallback
      const blob = new Blob([response.data]);
      if (window.showSaveFilePicker) {
        try {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: `${safeTitle}.${extension}`,
            types: [
              {
                description: extension === 'mp3' ? 'MP3 Audio' : 'MP4 Video',
                accept: {
                  [extension === 'mp3' ? 'audio/mpeg' : 'video/mp4']: [`.${extension}`]
                }
              }
            ]
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const typedFileHandle = fileHandle as any; // FileSystemFileHandle
          const writable = await typedFileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          // Show curl command for manual download as a helper
          showCmdHelper(videoInfo.url, `${safeTitle}.${extension}`);
        } catch {
          // If user cancels or error, fallback to download link
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${safeTitle}.${extension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          showCmdHelper(videoInfo.url, `${safeTitle}.${extension}`);
        }
      } else {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${safeTitle}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        showCmdHelper(videoInfo.url, `${safeTitle}.${extension}`);
      }
      setDownloadProgresses(prev => ({
        ...prev,
        [downloadId]: {
          percentage: 100,
          speed: '0 MB/s',
          eta: 'Complete',
          downloaded: format.size,
          total: format.size
        }
      }));
    } catch (err: unknown) {
      console.error('Download error:', err);
      const error = err as AxiosError<ApiErrorResponse>;
      setError(error.response?.data?.message || 'Download failed. Please try again.');
      setDownloadProgresses(prev => {
        const copy = { ...prev };
        delete copy[downloadId];
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };


  // Cancel a specific download by ID
  const cancelDownload = (downloadId: string) => {
    setDownloadProgresses(prev => {
      const copy = { ...prev };
      delete copy[downloadId];
      return copy;
    });
    setLoading(false);
  };

  const reset = () => {
    setVideoInfo(null);
    setVideoFormats([]);
    setAudioFormats([]);
    setDownloadProgresses({});
    setError(null);
    setLoading(false);
    setAnalyzing(false);
  };

  const updateSettings = (newSettings: DownloadSettings) => {
    setSettings(newSettings);
    localStorage.setItem('downloadSettings', JSON.stringify(newSettings));
  };

  // Helper to copy the last curl command to clipboard
  const copyCurlCommand = () => {
    if (lastCurlCommand && navigator.clipboard) {
      navigator.clipboard.writeText(lastCurlCommand);
    }
  };

  return {
    loading,
    analyzing,
    videoInfo,
    videoFormats,
    audioFormats,
    downloadProgresses,
    error,
    settings,
    extractVideoInfo,
    downloadMedia,
    cancelDownload,
    reset,
    updateSettings,
    lastCurlCommand,
    copyCurlCommand
  };
};