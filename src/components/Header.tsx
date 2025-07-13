import React from 'react';
import { Download, Youtube, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white/20 dark:bg-black/20 backdrop-blur-sm border-b border-black/10 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Youtube className="w-8 h-8 text-red-500" />
              <Download className="w-4 h-4 text-gray-800 dark:text-white absolute -bottom-1 -right-1 transition-colors duration-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">YTDownloader</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">Fast & Free Video Downloads</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={onOpenSettings}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
              About
            </button>
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
              FAQ
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
              Premium
            </button>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={onOpenSettings}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;