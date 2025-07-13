import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 dark:bg-black/20 light:bg-white/20 backdrop-blur-sm border-t border-white/10 dark:border-white/10 light:border-black/10 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white dark:text-white light:text-gray-800 font-bold text-xl mb-4 transition-colors duration-300">YTDownloader</h3>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 mb-4 transition-colors duration-300">
              The fastest and most reliable YouTube video downloader. 
              Download your favorite videos and audio in high quality.
            </p>
            <div className="flex space-x-4">
              <Github className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-800 cursor-pointer transition-colors duration-300" />
              <Twitter className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-800 cursor-pointer transition-colors duration-300" />
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-gray-800 cursor-pointer transition-colors duration-300" />
            </div>
          </div>
          
          <div>
            <h4 className="text-white dark:text-white light:text-gray-800 font-semibold mb-4 transition-colors duration-300">Links</h4>
            <ul className="space-y-2 text-gray-400 dark:text-gray-400 light:text-gray-600 transition-colors duration-300">
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white dark:text-white light:text-gray-800 font-semibold mb-4 transition-colors duration-300">Support</h4>
            <ul className="space-y-2 text-gray-400 dark:text-gray-400 light:text-gray-600 transition-colors duration-300">
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Help Center</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Report Bug</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Feature Request</a></li>
              <li><a href="#" className="hover:text-white dark:hover:text-white light:hover:text-gray-800 transition-colors duration-300">Donate</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 dark:border-white/10 light:border-black/10 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center transition-colors duration-300">
          <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm transition-colors duration-300">
            © 2025 YTDownloader. Made with <Heart className="w-4 h-4 text-red-500 inline mx-1" /> for video enthusiasts.
          </p>
          <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm mt-2 md:mt-0 transition-colors duration-300">
            Please respect copyright and only download content you have rights to.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;