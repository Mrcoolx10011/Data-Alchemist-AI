import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Database, 
  Brain, 
  FileText, 
  Users, 
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Revenue', value: '$2.4M', change: '+12.5%', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Active Users', value: '48.2K', change: '+8.2%', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Data Points', value: '1.2M', change: '+15.3%', icon: Database, color: 'from-purple-500 to-purple-600' },
    { label: 'AI Insights', value: '347', change: '+23.1%', icon: Brain, color: 'from-pink-500 to-pink-600' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 65000, users: 1200 },
    { month: 'Feb', revenue: 78000, users: 1400 },
    { month: 'Mar', revenue: 82000, users: 1600 },
    { month: 'Apr', revenue: 95000, users: 1800 },
    { month: 'May', revenue: 110000, users: 2100 },
    { month: 'Jun', revenue: 125000, users: 2400 },
  ];

  const categoryData = [
    { name: 'Sales', value: 35, color: '#3B82F6' },
    { name: 'Marketing', value: 25, color: '#8B5CF6' },
    { name: 'Support', value: 20, color: '#10B981' },
    { name: 'Development', value: 20, color: '#F59E0B' },
  ];

  const performanceData = [
    { metric: 'Conversion Rate', value: 3.2, target: 3.5 },
    { metric: 'Customer Satisfaction', value: 4.8, target: 4.5 },
    { metric: 'Response Time', value: 2.1, target: 2.0 },
    { metric: 'Data Accuracy', value: 98.5, target: 95.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Copyright Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white border-2 border-red-800 shadow-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">⚠️ COPYRIGHT NOTICE - STRICTLY PROHIBITED FOR COMMERCIAL USE</h3>
            <p className="text-red-100 text-sm leading-relaxed">
              <strong>© 2025 Kiran Mehta (kiran100112@gmail.com) - All Rights Reserved.</strong><br/>
              This project and all its components are the intellectual property of Kiran Mehta. 
              Any commercial use, reproduction, or distribution without explicit written permission is 
              <strong className="text-yellow-200"> STRICTLY PROHIBITED</strong> and will result in legal action.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Kiran!</h1>
            <p className="text-blue-100 text-lg">Your data insights are ready. Let's transform your business today.</p>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-white/20 rounded-full"
          >
            <Activity className="w-12 h-12" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
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
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#revenueGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Department Distribution</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
                <span className="text-sm font-semibold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceData.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
                <span className="text-lg font-bold text-gray-800">
                  {metric.metric === 'Response Time' ? `${metric.value}s` : 
                   metric.metric === 'Data Accuracy' ? `${metric.value}%` : metric.value}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
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
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
          <FileText className="w-5 h-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {[
            { action: 'New dataset uploaded', time: '2 minutes ago', type: 'upload' },
            { action: 'AI insight generated for Sales Q3', time: '15 minutes ago', type: 'insight' },
            { action: 'Monthly report generated', time: '1 hour ago', type: 'report' },
            { action: 'Data pipeline completed', time: '2 hours ago', type: 'process' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'upload' ? 'bg-green-500' :
                activity.type === 'insight' ? 'bg-purple-500' :
                activity.type === 'report' ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
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