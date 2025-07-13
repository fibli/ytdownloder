import React, { useState, useEffect } from 'react';
import { Settings, X, Folder, Check } from 'lucide-react';
import { DownloadSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DownloadSettings;
  onSave: (settings: DownloadSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<DownloadSettings>(settings);
  const [isSelectingPath, setIsSelectingPath] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const selectDownloadPath = async () => {
    setIsSelectingPath(true);
    try {
      // In a real implementation, this would use the File System Access API
      // For now, we'll simulate the path selection
      const mockPath = '/Users/Downloads/YTDownloader';
      setLocalSettings(prev => ({ ...prev, downloadPath: mockPath }));
    } catch (error) {
      console.error('Error selecting path:', error);
    } finally {
      setIsSelectingPath(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Download Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Download Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Download Location
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 truncate">
                {localSettings.downloadPath || 'Default Downloads Folder'}
              </div>
              <button
                onClick={selectDownloadPath}
                disabled={isSelectingPath}
                className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors"
              >
                {isSelectingPath ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Folder className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Default Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Video Quality
            </label>
            <select
              value={localSettings.quality}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, quality: e.target.value as 'highest' | 'lowest' | 'custom' }))}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="highest">Highest Available</option>
              <option value="lowest">Lowest Available</option>
              <option value="custom">Let me choose each time</option>
            </select>
          </div>

          {/* Default Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Video Format
            </label>
            <select
              value={localSettings.format}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, format: e.target.value as 'mp4' | 'mp3' | 'webm' }))}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="mp4">MP4 (Recommended)</option>
              <option value="webm">WebM</option>
              <option value="mp3">MP3 (Audio Only)</option>
            </select>
          </div>

          {/* Audio Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audio Quality
            </label>
            <select
              value={localSettings.audioQuality}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, audioQuality: e.target.value as 'highest' | 'lowest' }))}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="highest">Highest Quality</option>
              <option value="lowest">Smallest Size</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;