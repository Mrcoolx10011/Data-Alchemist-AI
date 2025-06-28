import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
  Star,
  Clock,
  BarChart3
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  timestamp: string;
  metrics?: {
    current: number;
    previous: number;
    change: number;
  };
}

const Insights: React.FC = () => {
  const { clients, workers, tasks } = useData();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Generate insights from actual user data instead of sample data
  const generateInsightsFromData = (): Insight[] => {
    const insights: Insight[] = [];
    
    if (clients.length === 0 && workers.length === 0 && tasks.length === 0) {
      return [{
        id: '1',
        type: 'recommendation',
        title: 'Start by Uploading Data',
        description: 'Upload your client, worker, and task data to begin generating AI-powered insights and recommendations.',
        impact: 'high',
        confidence: 100,
        timestamp: 'now'
      }];
    }

    // Priority distribution analysis
    if (clients.length > 0) {
      const priorities = clients.map(c => c.PriorityLevel);
      const avgPriority = priorities.reduce((sum, p) => sum + p, 0) / priorities.length;
      const highPriorityCount = priorities.filter(p => p >= 4).length;
      
      insights.push({
        id: '1',
        type: 'trend',
        title: 'Client Priority Distribution',
        description: `Average priority level is ${avgPriority.toFixed(1)}. ${highPriorityCount} clients (${((highPriorityCount/clients.length)*100).toFixed(0)}%) are high priority (4-5).`,
        impact: avgPriority >= 3.5 ? 'high' : 'medium',
        confidence: 92,
        timestamp: '1 minute ago',
        metrics: { current: avgPriority, previous: 3.0, change: ((avgPriority - 3.0) / 3.0 * 100) }
      });
    }

    // Skills coverage analysis
    if (workers.length > 0 && tasks.length > 0) {
      const workerSkills = new Set(workers.flatMap(w => w.Skills.split(';').map(s => s.trim())));
      const requiredSkills = new Set(tasks.flatMap(t => t.RequiredSkills.split(';').map(s => s.trim())));
      const coverageRatio = [...requiredSkills].filter(skill => workerSkills.has(skill)).length / requiredSkills.size;
      
      insights.push({
        id: '2',
        type: coverageRatio < 0.8 ? 'anomaly' : 'opportunity',
        title: `Skill Coverage Analysis`,
        description: `${(coverageRatio * 100).toFixed(0)}% of required skills are covered by current workers. ${coverageRatio < 0.8 ? 'Consider hiring or training.' : 'Good skill coverage detected.'}`,
        impact: coverageRatio < 0.6 ? 'high' : coverageRatio < 0.8 ? 'medium' : 'low',
        confidence: 88,
        timestamp: '5 minutes ago'
      });
    }

    // Workload balance analysis
    if (workers.length > 0) {
      const loads = workers.map(w => w.MaxLoadPerPhase);
      const maxLoad = Math.max(...loads);
      const minLoad = Math.min(...loads);
      const loadVariance = maxLoad - minLoad;
      
      if (loadVariance > 2) {
        insights.push({
          id: '3',
          type: 'recommendation',
          title: 'Workload Imbalance Detected',
          description: `Load variance of ${loadVariance} detected between workers. Consider redistributing tasks for better balance.`,
          impact: 'medium',
          confidence: 75,
          timestamp: '10 minutes ago'
        });
      }
    }

    // Group distribution analysis
    if (clients.length > 0) {
      const groups = clients.reduce((acc, client) => {
        acc[client.GroupTag] = (acc[client.GroupTag] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      const groupCounts = Object.values(groups);
      const isBalanced = Math.max(...groupCounts) - Math.min(...groupCounts) <= 2;
      
      insights.push({
        id: '4',
        type: isBalanced ? 'trend' : 'opportunity',
        title: 'Client Group Distribution',
        description: `${Object.keys(groups).length} groups detected. Distribution is ${isBalanced ? 'well balanced' : 'uneven - consider rebalancing'}.`,
        impact: 'medium',
        confidence: 85,
        timestamp: '15 minutes ago'
      });
    }

    return insights;
  };

  const insights = generateInsightsFromData();

  const categories = [
    { id: 'all', name: 'All Insights', icon: Brain },
    { id: 'trend', name: 'Trends', icon: TrendingUp },
    { id: 'anomaly', name: 'Anomalies', icon: AlertTriangle },
    { id: 'opportunity', name: 'Opportunities', icon: Target },
    { id: 'recommendation', name: 'Recommendations', icon: Lightbulb },
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === selectedCategory);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return TrendingUp;
      case 'anomaly':
        return AlertTriangle;
      case 'opportunity':
        return Target;
      case 'recommendation':
        return Lightbulb;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'from-blue-500 to-blue-600';
      case 'anomaly':
        return 'from-yellow-500 to-orange-600';
      case 'opportunity':
        return 'from-green-500 to-green-600';
      case 'recommendation':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-white/20 rounded-lg"
              >
                <Brain className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold">AI Insights</h1>
                <p className="text-purple-100">Discover patterns and opportunities in your data</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{insights.length}</div>
            <div className="text-purple-100">Active Insights</div>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-wrap gap-3">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            const count = category.id === 'all' ? insights.length : insights.filter(i => i.type === category.id).length;
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                }`}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{insight.timestamp}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed">{insight.description}</p>

              {/* Metrics */}
              {insight.metrics && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {insight.metrics.current.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Current</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-600">
                        {insight.metrics.previous.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Previous</div>
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${
                        insight.metrics.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {insight.metrics.change > 0 ? '+' : ''}{insight.metrics.change}%
                      </div>
                      <div className="text-xs text-gray-600">Change</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <span className="text-sm font-medium">View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Zap className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Assistant Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100"
      >
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant Ready</h3>
            <p className="text-gray-600 mb-4">
              I've analyzed your data and found {insights.length} actionable insights. 
              Would you like me to prioritize them or dive deeper into any specific area?
            </p>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Prioritize Insights
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ask Question
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Insights;