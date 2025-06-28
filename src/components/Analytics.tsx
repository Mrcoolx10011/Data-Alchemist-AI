import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Users,
  Briefcase,
  Activity
} from 'lucide-react';
import { 
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
import { useData } from '../context/DataContext';

const Analytics: React.FC = () => {
  const { clients, workers, tasks } = useData();

  // Generate analytics from user data only
  const analyticsData = useMemo(() => {
    if (!clients.length && !workers.length && !tasks.length) {
      return {
        priorityDistribution: [],
        groupDistribution: [],
        workerSkills: [],
        taskCategories: [],
        keyMetrics: {
          totalClients: 0,
          totalWorkers: 0,
          totalTasks: 0,
          avgPriority: 0
        }
      };
    }

    // Priority distribution from clients
    const priorityDistribution = [1, 2, 3, 4, 5].map(priority => ({
      priority: `Priority ${priority}`,
      count: clients.filter(c => c.PriorityLevel === priority).length,
      color: priority === 1 ? '#EF4444' : priority === 2 ? '#F97316' : priority === 3 ? '#EAB308' : priority === 4 ? '#22C55E' : '#3B82F6'
    }));

    // Group distribution from clients
    const groupCounts = clients.reduce((acc, client) => {
      acc[client.GroupTag] = (acc[client.GroupTag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const groupDistribution = Object.entries(groupCounts).map(([group, count], index) => ({
      group,
      count,
      color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'][index % 5]
    }));

    // Worker skills distribution
    const skillCounts = workers.reduce((acc, worker) => {
      if (worker.Skills) {
        const skills = worker.Skills.split(';');
        skills.forEach(skill => {
          const cleanSkill = skill.trim();
          acc[cleanSkill] = (acc[cleanSkill] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const workerSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count], index) => ({
        skill,
        count,
        color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#8B5A2B', '#EC4899'][index]
      }));

    // Task categories
    const categoryCounts = tasks.reduce((acc, task) => {
      acc[task.Category] = (acc[task.Category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const taskCategories = Object.entries(categoryCounts).map(([category, count], index) => ({
      category,
      count,
      color: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'][index % 6]
    }));

    const avgPriority = clients.length > 0 
      ? clients.reduce((sum, c) => sum + c.PriorityLevel, 0) / clients.length 
      : 0;

    return {
      priorityDistribution,
      groupDistribution,
      workerSkills,
      taskCategories,
      keyMetrics: {
        totalClients: clients.length,
        totalWorkers: workers.length,
        totalTasks: tasks.length,
        avgPriority: Math.round(avgPriority * 10) / 10
      }
    };
  }, [clients, workers, tasks]);

  // Show empty state if no data
  if (!clients.length && !workers.length && !tasks.length) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data for Analytics</h3>
            <p className="text-gray-600 mb-4">
              Upload your data to see detailed analytics and insights.
            </p>
            <div className="text-sm text-gray-500">
              Analytics will show:
              <br />• Priority distribution across clients
              <br />• Group and category breakdowns
              <br />• Skill distribution among workers
              <br />• Task category analysis
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.keyMetrics.totalClients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workers</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.keyMetrics.totalWorkers}</p>
            </div>
            <Briefcase className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.keyMetrics.totalTasks}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Priority</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.keyMetrics.avgPriority}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Priority Distribution Chart */}
      {analyticsData.priorityDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Priority Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.priorityDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="priority" stroke="#6b7280" />
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
                dataKey="count" 
                radius={[4, 4, 0, 0]}
              >
                {analyticsData.priorityDistribution.map((entry, index) => (
                  <Cell key={`priority-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Group Distribution Chart */}
      {analyticsData.groupDistribution.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <PieChart className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Group Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={analyticsData.groupDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ group, count }) => `${group}: ${count}`}
              >
                {analyticsData.groupDistribution.map((entry, index) => (
                  <Cell key={`group-${index}`} fill={entry.color} />
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
        </motion.div>
      )}

      {/* Worker Skills Chart */}
      {analyticsData.workerSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Top Worker Skills</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.workerSkills} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="skill" type="category" stroke="#6b7280" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 4, 4, 0]}
              >
                {analyticsData.workerSkills.map((entry, index) => (
                  <Cell key={`skill-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Task Categories Chart */}
      {analyticsData.taskCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center mb-6">
            <Activity className="h-6 w-6 text-orange-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">Task Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={analyticsData.taskCategories}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ category, count }) => `${category}: ${count}`}
              >
                {analyticsData.taskCategories.map((entry, index) => (
                  <Cell key={`category-${index}`} fill={entry.color} />
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
        </motion.div>
      )}
    </div>
  );
};

export default Analytics;