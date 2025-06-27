import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import Analytics from './components/Analytics';
import Insights from './components/Insights';
import Reports from './components/Reports';
import Settings from './components/Settings';
import NaturalLanguageSearch from './components/NaturalLanguageSearch';
import BusinessRulesManager from './components/BusinessRulesManager';
import PriorityWeightsManager from './components/PriorityWeightsManager';
import { DataProvider } from './context/DataContext';

export type ViewType = 'dashboard' | 'upload' | 'search' | 'rules' | 'priorities' | 'analytics' | 'insights' | 'reports' | 'settings';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'upload':
        return <DataUpload />;
      case 'search':
        return <NaturalLanguageSearch />;
      case 'rules':
        return <BusinessRulesManager />;
      case 'priorities':
        return <PriorityWeightsManager />;
      case 'analytics':
        return <Analytics />;
      case 'insights':
        return <Insights />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          currentView={currentView}
        />
        
        <div className="flex flex-1">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-16 z-30"
              >
                <Sidebar 
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <main 
            className={`flex-1 transition-all duration-300 ease-in-out pt-16 ${
              sidebarOpen ? 'ml-72' : 'ml-0'
            }`}
          >
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-6"
            >
              {renderView()}
            </motion.div>
          </main>
        </div>
        
        {/* Compact Copyright Footer */}
        <footer className="bg-gray-800 text-white py-2 px-4 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center space-x-1">
                <span className="text-red-400">©</span>
                <span>2025 Kiran Mehta - All Rights Reserved</span>
              </span>
              <span className="text-red-300">Commercial Use Prohibited</span>
            </div>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;