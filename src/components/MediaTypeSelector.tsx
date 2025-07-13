import React from 'react';
import { Video, Music } from 'lucide-react';

interface MediaTypeSelectorProps {
  selectedType: 'video' | 'audio';
  onTypeChange: (type: 'video' | 'audio') => void;
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onTypeChange('video')}
        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
          selectedType === 'video'
            ? 'border-red-500 bg-red-500/10 text-red-500'
            : 'border-gray-300 dark:border-gray-600 bg-white/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <Video className="w-8 h-8" />
          <span className="font-semibold">Video</span>
          <span className="text-sm opacity-75">Download with video and audio</span>
        </div>
      </button>
      
      <button
        onClick={() => onTypeChange('audio')}
        className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 ${
          selectedType === 'audio'
            ? 'border-red-500 bg-red-500/10 text-red-500'
            : 'border-gray-300 dark:border-gray-600 bg-white/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:border-red-300 hover:text-red-400'
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <Music className="w-8 h-8" />
          <span className="font-semibold">Audio Only</span>
          <span className="text-sm opacity-75">Extract audio as MP3</span>
        </div>
      </button>
    </div>
  );
};

export default MediaTypeSelector;