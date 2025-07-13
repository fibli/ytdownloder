import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

const URLInput: React.FC<URLInputProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className="w-full h-16 pl-6 pr-32 bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-black/20 dark:border-white/20 rounded-2xl text-gray-800 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="absolute right-2 top-2 h-12 px-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 flex items-center space-x-2 font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </form>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-4 text-center transition-colors duration-300">
        Supports YouTube videos and playlists. Please respect copyright and only download content you have rights to.
      </p>
    </div>
  );
};

export default URLInput;