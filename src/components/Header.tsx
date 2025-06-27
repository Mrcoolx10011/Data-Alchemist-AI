import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Zap, Bell, User, Search } from 'lucide-react';
import { ViewType } from '../App';

interface HeaderProps {
  onMenuClick: () => void;
  currentView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentView }) => {
  const getViewTitle = (view: ViewType) => {
    const titles = {
      dashboard: 'Dashboard',
      upload: 'Data Upload',
      search: 'AI Search',
      rules: 'Business Rules',
      priorities: 'Priorities & Weights',
      analytics: 'Analytics',
      insights: 'AI Insights',
      reports: 'Reports',
      settings: 'Settings'
    };
    return titles[view] || 'Data Alchemist AI';
  };

  return (
    <motion.header 
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Alchemist AI
              </h1>
              <p className="text-sm text-gray-500">{getViewTitle(currentView)}</p>
              <p className="text-xs text-red-600 font-medium">© 2025 Kiran Mehta - Commercial Use Prohibited</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search data, insights..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Kiran Mehta</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;