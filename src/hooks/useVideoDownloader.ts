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
            const speed = calculateSpeed(progressEvent.loaded, Date.now());
            const eta = calculateETA(progressEvent.loaded, progressEvent.total, speed);
            setDownloadProgresses(prev => ({
              ...prev,
              [downloadId]: {
                percentage,
                speed: `${speed.toFixed(2)} MB/s`,
                eta: eta,
                downloaded: `${downloadedMB} MB`,
                total: `${totalMB} MB`
              }
            }));
          }
        }
      });
      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${safeTitle}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
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

  const calculateSpeed = (loaded: number, startTime: number): number => {
    const elapsed = (Date.now() - startTime) / 1000;
    return elapsed > 0 ? (loaded / (1024 * 1024)) / elapsed : 0;
  };

  const calculateETA = (loaded: number, total: number, speedMBps: number): string => {
    if (speedMBps === 0) return 'Calculating...';
    const remaining = (total - loaded) / (1024 * 1024);
    const eta = remaining / speedMBps;
    
    if (eta < 60) return `${Math.ceil(eta)}s`;
    if (eta < 3600) return `${Math.ceil(eta / 60)}m`;
    return `${Math.ceil(eta / 3600)}h`;
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
    updateSettings
  };
};