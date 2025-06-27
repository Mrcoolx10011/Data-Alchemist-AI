import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Share, 
  Calendar, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'dashboard' | 'analytics' | 'financial' | 'custom';
  status: 'draft' | 'published' | 'scheduled';
  createdBy: string;
  createdAt: string;
  lastModified: string;
  views: number;
  size: string;
}

const Reports: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const reports: Report[] = [
    {
      id: '1',
      title: 'Q3 Performance Dashboard',
      description: 'Comprehensive overview of Q3 metrics including revenue, user growth, and key performance indicators.',
      type: 'dashboard',
      status: 'published',
      createdBy: 'Kiran Mehta',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      views: 247,
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Customer Analytics Report',
      description: 'Deep dive into customer behavior patterns, segmentation analysis, and retention metrics.',
      type: 'analytics',
      status: 'published',
      createdBy: 'Sarah Johnson',
      createdAt: '2024-01-12',
      lastModified: '2024-01-18',
      views: 189,
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'Financial Summary - January',
      description: 'Monthly financial report covering revenue, expenses, profit margins, and budget analysis.',
      type: 'financial',
      status: 'draft',
      createdBy: 'Mike Wilson',
      createdAt: '2024-01-10',
      lastModified: '2024-01-22',
      views: 45,
      size: '3.1 MB'
    },
    {
      id: '4',
      title: 'Marketing Campaign Analysis',
      description: 'ROI analysis and performance metrics for recent marketing campaigns across all channels.',
      type: 'custom',
      status: 'scheduled',
      createdBy: 'Emma Davis',
      createdAt: '2024-01-08',
      lastModified: '2024-01-19',
      views: 156,
      size: '1.2 MB'
    },
    {
      id: '5',
      title: 'User Engagement Trends',
      description: 'Analysis of user engagement patterns, feature adoption, and usage statistics over time.',
      type: 'analytics',
      status: 'published',
      createdBy: 'Kiran Mehta',
      createdAt: '2024-01-05',
      lastModified: '2024-01-17',
      views: 203,
      size: '2.7 MB'
    },
    {
      id: '6',
      title: 'Operational Efficiency Report',
      description: 'Comprehensive analysis of operational metrics, process efficiency, and resource utilization.',
      type: 'custom',
      status: 'published',
      createdBy: 'David Brown',
      createdAt: '2024-01-03',
      lastModified: '2024-01-16',
      views: 134,
      size: '1.9 MB'
    }
  ];

  const filters = [
    { id: 'all', name: 'All Reports', count: reports.length },
    { id: 'dashboard', name: 'Dashboards', count: reports.filter(r => r.type === 'dashboard').length },
    { id: 'analytics', name: 'Analytics', count: reports.filter(r => r.type === 'analytics').length },
    { id: 'financial', name: 'Financial', count: reports.filter(r => r.type === 'financial').length },
    { id: 'custom', name: 'Custom', count: reports.filter(r => r.type === 'custom').length },
  ];

  const filteredReports = selectedFilter === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dashboard':
        return BarChart3;
      case 'analytics':
        return TrendingUp;
      case 'financial':
        return FileText;
      case 'custom':
        return Edit;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dashboard':
        return 'from-blue-500 to-blue-600';
      case 'analytics':
        return 'from-purple-500 to-purple-600';
      case 'financial':
        return 'from-green-500 to-green-600';
      case 'custom':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
              <p className="text-gray-600">Generate, manage, and share your data reports</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm">{filter.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    selectedFilter === filter.id ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Date Range</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export All</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => {
          const TypeIcon = getTypeIcon(report.type);
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getTypeColor(report.type)}`}>
                  <TypeIcon className="w-5 h-5 text-white" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                  {report.status.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-800 mb-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{report.description}</p>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>Created by {report.createdBy}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Modified {report.lastModified}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-3 h-3" />
                    <span>{report.views} views</span>
                  </div>
                  <span>{report.size}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </motion.button>
                
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Share className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-800">Create Dashboard</h4>
              <p className="text-sm text-gray-600">Interactive data dashboard</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-800">Analytics Report</h4>
              <p className="text-sm text-gray-600">Detailed data analysis</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-800">Custom Report</h4>
              <p className="text-sm text-gray-600">Build from template</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;