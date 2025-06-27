import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  Brain, 
  FileText, 
  Settings,
  Sparkles,
  Search,
  Sliders,
  TrendingUp
} from 'lucide-react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { id: 'upload', label: 'Data Upload', icon: Upload, color: 'from-green-500 to-green-600' },
    { id: 'search', label: 'AI Search', icon: Search, color: 'from-purple-500 to-purple-600' },
    { id: 'rules', label: 'Business Rules', icon: Settings, color: 'from-orange-500 to-orange-600' },
    { id: 'priorities', label: 'Priorities & Weights', icon: Sliders, color: 'from-pink-500 to-pink-600' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-indigo-500 to-indigo-600' },
    { id: 'insights', label: 'AI Insights', icon: Brain, color: 'from-cyan-500 to-cyan-600' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'from-emerald-500 to-emerald-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <motion.div 
      className="w-72 h-screen bg-white/90 backdrop-blur-lg border-r border-gray-200/50 shadow-lg"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
              <p className="text-xs text-gray-600">Ready to analyze</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewChange(item.id as ViewType)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isActive 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-r ${item.color} text-white`
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Quick Stats</span>
          </div>
          <div className="space-y-2 text-xs text-amber-700">
            <div className="flex justify-between">
              <span>Datasets</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span>Insights Generated</span>
              <span className="font-semibold">47</span>
            </div>
            <div className="flex justify-between">
              <span>Reports Created</span>
              <span className="font-semibold">8</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;