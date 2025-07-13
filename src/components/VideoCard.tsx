import React from 'react';
import { Clock, Eye, User, Calendar } from 'lucide-react';
import { VideoInfo } from '../types';

interface VideoCardProps {
  video: VideoInfo;
  onDownload: (format: string, quality: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const formats = [
    { quality: '1080p', format: 'MP4', size: '~150MB' },
    { quality: '720p', format: 'MP4', size: '~80MB' },
    { quality: '480p', format: 'MP4', size: '~45MB' },
    { quality: '360p', format: 'MP4', size: '~25MB' },
    { quality: 'Audio', format: 'MP3', size: '~8MB' },
  ];

  return (
    <div className="bg-white/10 dark:bg-white/10 light:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/20 light:border-black/20 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-white/15 light:hover:bg-black/15 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 lg:h-auto object-cover rounded-xl"
          />
        </div>
        
        <div className="lg:w-2/3 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-800 mb-2 line-clamp-2 transition-colors duration-300">
              {video.title}
            </h3>
            
            <div className="flex flex-wrap gap-4 text-gray-300 dark:text-gray-300 light:text-gray-600 text-sm transition-colors duration-300">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{video.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{video.views} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{video.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{video.uploadDate}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white dark:text-white light:text-gray-800 font-semibold transition-colors duration-300">Download Options:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formats.map((format, index) => (
                <button
                  key={index}
                  onClick={() => onDownload(format.format, format.quality)}
                  className="flex items-center justify-between p-3 bg-black/20 dark:bg-black/20 light:bg-white/20 hover:bg-black/30 dark:hover:bg-black/30 light:hover:bg-white/30 border border-white/10 dark:border-white/10 light:border-black/10 rounded-lg transition-all duration-300 group"
                >
                  <div className="text-left">
                    <div className="text-white dark:text-white light:text-gray-800 font-medium transition-colors duration-300">{format.quality}</div>
                    <div className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm transition-colors duration-300">{format.format} • {format.size}</div>
                  </div>
                  <div className="w-8 h-8 bg-red-500 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-300">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;