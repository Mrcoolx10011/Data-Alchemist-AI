import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  FileText, 
  Users, 
  Activity,
  BarChart3,
  Upload
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';

const Dashboard: React.FC = () => {
  const { clients, workers, tasks, validationErrors } = useData();

  // Dynamic stats based on actual data
  const stats = [
    { 
      label: 'Total Clients', 
      value: clients.length.toString(), 
      change: clients.length > 0 ? '+100%' : '0%', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'Total Workers', 
      value: workers.length.toString(), 
      change: workers.length > 0 ? '+100%' : '0%', 
      icon: Users, 
      color: 'from-green-500 to-green-600' 
    },
    { 
      label: 'Total Tasks', 
      value: tasks.length.toString(), 
      change: tasks.length > 0 ? '+100%' : '0%', 
      icon: FileText, 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      label: 'Data Quality', 
      value: validationErrors.length === 0 ? '100%' : `${Math.max(0, 100 - validationErrors.length * 2)}%`, 
      change: validationErrors.length === 0 ? '+100%' : `${validationErrors.length} issues`, 
      icon: Brain, 
      color: validationErrors.length === 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
    },
  ];

  // Dynamic data for charts based on uploaded data
  const getClientGroupData = () => {
    if (clients.length === 0) return [];
    
    const groupCounts = clients.reduce((acc: any, client: any) => {
      const group = client.GroupTag || 'Unknown';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
    return Object.entries(groupCounts).map(([group, count], index) => ({
      name: group,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const getPriorityDistribution = () => {
    if (clients.length === 0) return [];
    
    const priorityCounts = clients.reduce((acc: any, client: any) => {
      const priority = `Level ${client.PriorityLevel || 'Unknown'}`;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(priorityCounts).map(([priority, count]) => ({
      priority,
      count,
      percentage: Math.round(((count as number) / clients.length) * 100)
    }));
  };

  const categoryData = getClientGroupData();
  const priorityData = getPriorityDistribution();

  const performanceData = [
    { 
      metric: 'Data Upload Rate', 
      value: clients.length > 0 ? 100 : 0, 
      target: 100 
    },
    { 
      metric: 'Validation Success', 
      value: validationErrors.length === 0 ? 100 : Math.max(0, 100 - validationErrors.length * 2), 
      target: 95 
    },
    { 
      metric: 'Processing Speed', 
      value: 98.5, 
      target: 95.0 
    },
    { 
      metric: 'System Reliability', 
      value: 99.2, 
      target: 99.0 
    },
  ];

  // Check if any data has been uploaded
  const hasData = clients.length > 0 || workers.length > 0 || tasks.length > 0;

  // If no data, show empty state
  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 text-white"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome to Data Alchemist AI!</h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Upload your data to start transforming your business insights.</p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 sm:p-4 bg-white/20 rounded-full self-center sm:self-auto"
            >
              <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </motion.div>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Uploaded Yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            To get started, please upload your CSV or Excel files containing clients, workers, and tasks data.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '#/data-upload'}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Your Data
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:space-y-4 xl:space-y-5">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 text-white"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Welcome back, Kiran!</h1>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">Your data insights are ready. Let's transform your business today.</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 sm:p-4 bg-white/20 rounded-full self-center sm:self-auto"
          >
            <Activity className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid - Optimized for desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-green-500 text-xs sm:text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section - Optimized for desktop with better grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-5">
        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Priority Distribution</h3>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="priority" 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500">
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-gray-300" />
              <p className="text-center text-sm sm:text-base px-4">No data available. Upload client data to see priority distribution.</p>
            </div>
          )}
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Department Distribution</h3>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{item.name}</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800">{String(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500">
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-gray-300" />
              <p className="text-center text-sm sm:text-base px-4">No data available. Upload client data to see department distribution.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Performance Metrics</h3>
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
          {performanceData.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-600 pr-2">{metric.metric}</span>
                <span className="text-base sm:text-lg font-bold text-gray-800 flex-shrink-0">
                  {metric.metric === 'Response Time' ? `${metric.value}s` : 
                   metric.metric === 'Data Accuracy' ? `${metric.value}%` : metric.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ 
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Target: {metric.target}</span>
                <span className={metric.value >= metric.target ? 'text-green-600' : 'text-yellow-600'}>
                  {metric.value >= metric.target ? 'On Track' : 'Needs Attention'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Recent Activity</h3>
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </div>
        <div className="space-y-2 sm:space-y-3">
          {[
            { action: 'New dataset uploaded', time: '2 minutes ago', type: 'upload' },
            { action: 'AI insight generated for Sales Q3', time: '15 minutes ago', type: 'insight' },
            { action: 'Monthly report generated', time: '1 hour ago', type: 'report' },
            { action: 'Data pipeline completed', time: '2 hours ago', type: 'process' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                activity.type === 'upload' ? 'bg-green-500' :
                activity.type === 'insight' ? 'bg-purple-500' :
                activity.type === 'report' ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;