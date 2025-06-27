import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  Filter,
  Download,
  Share,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';
import { useData } from '../context/DataContext';

const Analytics: React.FC = () => {
  const { data } = useData();
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Sample analytics data
  const analyticsData = [
    { month: 'Jan', revenue: 65000, users: 1200, conversion: 3.2, satisfaction: 4.2 },
    { month: 'Feb', revenue: 78000, users: 1400, conversion: 3.5, satisfaction: 4.3 },
    { month: 'Mar', revenue: 82000, users: 1600, conversion: 3.8, satisfaction: 4.1 },
    { month: 'Apr', revenue: 95000, users: 1800, conversion: 4.1, satisfaction: 4.4 },
    { month: 'May', revenue: 110000, users: 2100, conversion: 4.3, satisfaction: 4.5 },
    { month: 'Jun', revenue: 125000, users: 2400, conversion: 4.6, satisfaction: 4.6 },
    { month: 'Jul', revenue: 135000, users: 2600, conversion: 4.8, satisfaction: 4.7 },
    { month: 'Aug', revenue: 142000, users: 2800, conversion: 5.1, satisfaction: 4.8 },
  ];

  const categoryData = [
    { name: 'Product Sales', value: 45, color: '#3B82F6' },
    { name: 'Services', value: 30, color: '#8B5CF6' },
    { name: 'Subscriptions', value: 15, color: '#10B981' },
    { name: 'Other', value: 10, color: '#F59E0B' },
  ];

  const scatterData = [
    { x: 1200, y: 65000, z: 3.2 },
    { x: 1400, y: 78000, z: 3.5 },
    { x: 1600, y: 82000, z: 3.8 },
    { x: 1800, y: 95000, z: 4.1 },
    { x: 2100, y: 110000, z: 4.3 },
    { x: 2400, y: 125000, z: 4.6 },
    { x: 2600, y: 135000, z: 4.8 },
    { x: 2800, y: 142000, z: 5.1 },
  ];

  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: LineChart },
    { id: 'area', name: 'Area Chart', icon: TrendingUp },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', name: 'Pie Chart', icon: PieChart },
  ];

  const metrics = [
    { id: 'revenue', name: 'Revenue', color: '#3B82F6' },
    { id: 'users', name: 'Users', color: '#8B5CF6' },
    { id: 'conversion', name: 'Conversion Rate', color: '#10B981' },
    { id: 'satisfaction', name: 'Satisfaction', color: '#F59E0B' },
  ];

  const renderChart = () => {
    const currentMetric = metrics.find(m => m.id === selectedMetric);
    
    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsLineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={currentMetric?.color} 
                strokeWidth={3}
                dot={{ fill: currentMetric?.color, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: currentMetric?.color, strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analyticsData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentMetric?.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={currentMetric?.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={currentMetric?.color} 
                strokeWidth={3}
                fill="url(#areaGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey={selectedMetric} 
                fill={currentMetric?.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
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
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
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
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
              <p className="text-gray-600">Visualize and analyze your data with interactive charts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
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
              <span className="text-sm font-medium text-gray-700">Chart Type:</span>
            </div>
            <div className="flex space-x-2">
              {chartTypes.map((chart) => {
                const Icon = chart.icon;
                return (
                  <motion.button
                    key={chart.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedChart(chart.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                      selectedChart === chart.id
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{chart.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {selectedChart !== 'pie' && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Metric:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {metrics.map((metric) => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            {chartTypes.find(c => c.id === selectedChart)?.name} - {metrics.find(m => m.id === selectedMetric)?.name}
          </h3>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        {renderChart()}
      </motion.div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Correlation Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Users vs Revenue Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="x" name="Users" stroke="#6b7280" />
              <YAxis dataKey="y" name="Revenue" stroke="#6b7280" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'x' ? `${value} users` : `$${value.toLocaleString()}`,
                  name === 'x' ? 'Users' : 'Revenue'
                ]}
              />
              <Scatter dataKey="y" fill="#8B5CF6" />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
          <div className="space-y-4">
            {[
              { label: 'Revenue Growth', value: '+23.5%', color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'User Acquisition', value: '+18.2%', color: 'text-blue-600', bg: 'bg-blue-100' },
              { label: 'Conversion Rate', value: '+12.8%', color: 'text-purple-600', bg: 'bg-purple-100' },
              { label: 'Customer Satisfaction', value: '+8.4%', color: 'text-orange-600', bg: 'bg-orange-100' },
            ].map((kpi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100"
              >
                <span className="font-medium text-gray-700">{kpi.label}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${kpi.color} ${kpi.bg}`}>
                  {kpi.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
            <div className="text-sm text-gray-600">Data Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">4</div>
            <div className="text-sm text-gray-600">Metrics Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Data Quality</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">Live</div>
            <div className="text-sm text-gray-600">Update Status</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;