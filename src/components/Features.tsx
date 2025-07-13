import React from 'react';
import { Zap, Shield, Smartphone, Download, Play, Music } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Lightning Fast',
      description: 'Download videos in seconds with our optimized servers'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: 'Safe & Secure',
      description: 'No malware, no ads, just clean and safe downloads'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices and screen sizes'
    },
    {
      icon: <Download className="w-8 h-8 text-purple-500" />,
      title: 'Multiple Formats',
      description: 'Download in MP4, MP3, and various quality options'
    },
    {
      icon: <Play className="w-8 h-8 text-red-500" />,
      title: 'HD Quality',
      description: 'Support for up to 4K resolution downloads'
    },
    {
      icon: <Music className="w-8 h-8 text-pink-500" />,
      title: 'Audio Only',
      description: 'Extract audio and download as MP3 files'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white/5 dark:bg-white/5 light:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-white/10 light:border-black/10 rounded-xl p-6 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10 transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            {feature.icon}
            <h3 className="text-white dark:text-white light:text-gray-800 font-semibold text-lg transition-colors duration-300">{feature.title}</h3>
          </div>
          <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 transition-colors duration-300">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;