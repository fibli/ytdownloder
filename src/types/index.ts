export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  views: string;
  uploadDate: string;
  description: string;
  url: string;
}

export interface VideoFormat {
  itag: number;
  quality: string;
  qualityLabel: string;
  format: string;
  container: string;
  size: string;
  bitrate: number;
  fps?: number;
  hasVideo: boolean;
  hasAudio: boolean;
  url: string;
}

export interface AudioFormat {
  itag: number;
  quality: string;
  format: string;
  container: string;
  size: string;
  bitrate: number;
  sampleRate: number;
  url: string;
}

export interface DownloadProgress {
  percentage: number;
  speed: string;
  eta: string;
  downloaded: string;
  total: string;
}

export interface DownloadSettings {
  downloadPath: string;
  quality: 'highest' | 'lowest' | 'custom';
  format: 'mp4' | 'mp3' | 'webm';
  audioQuality: 'highest' | 'lowest';
}