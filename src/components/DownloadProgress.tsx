import React from 'react';
import { Download, CheckCircle, X } from 'lucide-react';
import { DownloadProgress as DownloadProgressType } from '../types';

interface DownloadProgressProps {
  progress: DownloadProgressType;
  onCancel: () => void;
  fileName: string;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({ 
  progress, 
  onCancel, 
  fileName 
}) => {
  const isComplete = progress.percentage >= 100;

  return (
    <div className="bg-white/10 dark:bg-white/10 light:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-white/20 light:border-black/20 rounded-xl p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {isComplete ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <Download className="w-6 h-6 text-blue-500" />
          )}
          <div>
            <p className="text-white dark:text-white light:text-gray-800 font-medium truncate max-w-xs transition-colors duration-300">
              {fileName}
            </p>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm transition-colors duration-300">
              {isComplete ? 'Download complete' : `${progress.downloaded}/${progress.total} • ${progress.speed} • ETA: ${progress.eta}`}
            </p>
          </div>
        </div>
        
        {!isComplete && (
          <button
            onClick={onCancel}
            className="text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="w-full bg-gray-700 dark:bg-gray-700 light:bg-gray-300 rounded-full h-2 transition-colors duration-300">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isComplete ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(progress.percentage, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mt-2 transition-colors duration-300">
        <span>{progress.percentage.toFixed(1)}%</span>
        <span>{isComplete ? 'Ready' : 'Downloading...'}</span>
      </div>
    </div>
  );
};

export default DownloadProgress;