import React from 'react';
import { Download, Play, Music } from 'lucide-react';
import { VideoFormat, AudioFormat } from '../types';

interface DownloadProgressMap {
  [downloadId: string]: import('../types').DownloadProgress;
}
interface QualitySelectorProps {
  mediaType: 'video' | 'audio';
  videoFormats: VideoFormat[];
  audioFormats: AudioFormat[];
  onDownload: (format: VideoFormat | AudioFormat) => void;
  loading?: boolean;
  downloadProgresses?: DownloadProgressMap;
  videoTitle?: string;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({
  mediaType,
  videoFormats,
  audioFormats,
  onDownload,
  loading = false,
  downloadProgresses = {},
  videoTitle = 'download'
}) => {

  const getQualityColor = (quality: string): string => {
    if (quality.includes('2160') || quality.includes('4K')) return 'text-purple-500';
    if (quality.includes('1440') || quality.includes('2K')) return 'text-blue-500';
    if (quality.includes('1080')) return 'text-green-500';
    if (quality.includes('720')) return 'text-yellow-500';
    if (quality.includes('480')) return 'text-orange-500';
    return 'text-gray-500';
  };

  const formats = mediaType === 'video' ? videoFormats : audioFormats;

  if (formats.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 dark:text-gray-400">
          {loading ? 'Loading available formats...' : 'No formats available'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Available {mediaType === 'video' ? 'Video' : 'Audio'} Formats
      </h3>
      
      <div className="grid gap-3">
        {formats.map((format, index) => {
          // Compute downloadId as in useVideoDownloader, using videoTitle
          const extension = format.format === 'mp3' ? 'mp3' : 'mp4';
          const safeTitle = videoTitle.replace(/[^a-zA-Z0-9]/g, '_') || 'download';
          const downloadId = `${safeTitle}_${format.itag}_${extension}`;
          const isDownloading = !!downloadProgresses[downloadId];
          return (
            <div
              key={index}
            className="bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-xl p-4 hover:bg-white/15 dark:hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg">
                  {mediaType === 'video' ? (
                    <Play className="w-6 h-6 text-red-500" />
                  ) : (
                    <Music className="w-6 h-6 text-red-500" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getQualityColor(format.quality)}`}>
                      {mediaType === 'video' 
                        ? (format as VideoFormat).qualityLabel || format.quality
                        : `${format.quality} kbps`
                      }
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {format.format.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>{format.size}</span>
                    <span>{format.bitrate} kbps</span>
                    {mediaType === 'video' && (format as VideoFormat).fps && (
                      <span>{(format as VideoFormat).fps} fps</span>
                    )}
                    {mediaType === 'audio' && (
                      <span>{(format as AudioFormat).sampleRate} Hz</span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onDownload(format)}
                disabled={isDownloading}
                className={`flex items-center space-x-2 px-4 py-2 ${isDownloading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg transition-colors duration-300`}
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default QualitySelector;