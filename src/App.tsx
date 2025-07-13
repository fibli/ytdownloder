// import React from 'react';
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import URLInput from './components/URLInput';
import MediaTypeSelector from './components/MediaTypeSelector';
import QualitySelector from './components/QualitySelector';
import DownloadProgress from './components/DownloadProgress';
import Features from './components/Features';
import Footer from './components/Footer';
import SettingsModal from './components/SettingsModal';
import { useVideoDownloader } from './hooks/useVideoDownloader';
import { AlertCircle } from 'lucide-react';

function App() {
  const {
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
  } = useVideoDownloader();

  const [selectedMediaType, setSelectedMediaType] = useState<'video' | 'audio'>('video');
  const [showSettings, setShowSettings] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-900 transition-all duration-500">
        <Header onOpenSettings={() => setShowSettings(true)} />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent transition-colors duration-300">
              Download YouTube Videos
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
              Fast, free, and easy YouTube video downloader. 
              Download in HD quality with no registration required.
            </p>
            
            <URLInput onSubmit={extractVideoInfo} loading={analyzing} />
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-200 transition-colors duration-300">{error}</p>
                <button
                  onClick={reset}
                  className="ml-auto text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-white transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Video Information and Media Type Selection */}
          {videoInfo && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  <div className="lg:w-1/3">
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-full h-48 lg:h-auto object-cover rounded-xl"
                    />
                  </div>
                  
                  <div className="lg:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2 transition-colors duration-300">
                        {videoInfo.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                        <span>{videoInfo.author}</span>
                        <span>{videoInfo.views} views</span>
                        <span>{videoInfo.duration}</span>
                        <span>{videoInfo.uploadDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <MediaTypeSelector 
                  selectedType={selectedMediaType}
                  onTypeChange={setSelectedMediaType}
                />
              </div>
              
              <div className="bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20 rounded-2xl p-6">
                <QualitySelector
                  mediaType={selectedMediaType}
                  videoFormats={videoFormats}
                  audioFormats={audioFormats}
                  onDownload={downloadMedia}
                  loading={loading}
                  downloadProgresses={downloadProgresses}
                  videoTitle={videoInfo.title}
                />
              </div>
            </div>
          )}

          {/* Multi-Download Progress */}
          {videoInfo && Object.keys(downloadProgresses).length > 0 && (
            <div className="max-w-4xl mx-auto mb-8 space-y-4">
              {Object.entries(downloadProgresses).map(([downloadId, progress]) => (
                <DownloadProgress
                  key={downloadId}
                  progress={progress}
                  onCancel={() => cancelDownload(downloadId)}
                  fileName={downloadId.replace(/_/g, ' ').replace(/\.[a-z0-9]+$/i, '')}
                />
              ))}
            </div>
          )}

          {/* Features Section */}
          {!videoInfo && (
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-12 transition-colors duration-300">
                Why Choose Our Downloader?
              </h2>
              <Features />
            </div>
          )}

          {/* Legal Notice */}
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2 transition-colors duration-300">⚠️ Important Legal Notice</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-300">
                This tool is for educational purposes and personal use only. 
                Please respect copyright laws and YouTube's Terms of Service. 
                Only download content you have rights to or that is in the public domain. 
                We are not responsible for any misuse of this tool.
              </p>
            </div>
          </div>
        </main>

        <Footer />
        
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSave={updateSettings}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;