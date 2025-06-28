import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Filter,
  Download,
  Share,
  RefreshCw
} from 'lucide-react';
import { useData } from '../context/DataContext';
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
  ResponsiveContainer
} from 'recharts';

const Analytics: React.FC = () => {
  const { clients, workers, tasks } = useData();
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('priority');

  // Generate analytics data from actual user data
  const hasData = clients.length > 0 || workers.length > 0 || tasks.length > 0;

  // Generate real analytics from user data
  const generateAnalyticsData = () => {
    if (!hasData) return [];

    const priorityDistribution = [1, 2, 3, 4, 5].map(priority => ({
      priority: `Priority ${priority}`,
      count: clients.filter(c => c.PriorityLevel === priority).length,
      color: priority === 1 ? '#EF4444' : priority === 2 ? '#F97316' : 
             priority === 3 ? '#EAB308' : priority === 4 ? '#22C55E' : '#3B82F6'
    }));

    return priorityDistribution;
  };

  const generateGroupData = () => {
    if (!hasData) return [];

    const groups = [...new Set(clients.map(c => c.GroupTag))];
    return groups.map(group => ({
      name: group,
      value: clients.filter(c => c.GroupTag === group).length,
      color: group === 'GroupA' ? '#3B82F6' : group === 'GroupB' ? '#8B5CF6' : '#10B981'
    }));
  };

  const generateSkillData = () => {
    if (!hasData) return [];

    const skillCounts: { [key: string]: number } = {};
    workers.forEach(worker => {
      worker.Skills.split(';').forEach(skill => {
        const cleanSkill = skill.trim();
        skillCounts[cleanSkill] = (skillCounts[cleanSkill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({
        skill,
        count,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const analyticsData = generateAnalyticsData();
  const groupData = generateGroupData();
  const skillData = generateSkillData();

  const chartTypes = [
    { id: 'line', name: 'Priority Distribution', icon: LineChart },
    { id: 'area', name: 'Group Analysis', icon: TrendingUp },
    { id: 'bar', name: 'Skills Overview', icon: BarChart3 },
    { id: 'pie', name: 'Group Distribution', icon: PieChart },
  ];

  const metrics = [
    { id: 'priority', name: 'Priority Levels' },
    { id: 'groups', name: 'Client Groups' },
    { id: 'skills', name: 'Worker Skills' },
    { id: 'workload', name: 'Task Distribution' },
  ];

  const renderChart = () => {
    if (!hasData) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No data available. Upload data to see analytics.</p>
          </div>
        </div>
      );
    }

    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={groupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {groupData.map((entry, index) => (
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 md:p-3 rounded-lg">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Analytics</h1>
              <p className="text-sm md:text-base text-gray-600">
                {hasData 
                  ? `Analyzing ${clients.length} clients, ${workers.length} workers, and ${tasks.length} tasks`
                  : 'Upload data to start analyzing'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Chart Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {chartTypes.map((chart) => {
              const Icon = chart.icon;
              return (
                <button
                  key={chart.id}
                  onClick={() => setSelectedChart(chart.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedChart === chart.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{chart.name}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Chart Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {chartTypes.find(chart => chart.id === selectedChart)?.name}
          </h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Share className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="h-64 lg:h-80">
          {renderChart()}
        </div>
      </motion.div>

      {/* Statistics Grid */}
      {hasData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold text-gray-900">{workers.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Priority</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.length > 0 
                    ? (clients.reduce((sum, c) => sum + c.PriorityLevel, 0) / clients.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <LineChart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;
