import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  BarChart3,
  Zap,
  Shield,
  Download
} from 'lucide-react';
import { useData, PriorityCriteria } from '../context/DataContext';

interface PresetProfile {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  weights: Record<string, number>;
  color: string;
}

const PriorityWeightsManager: React.FC = () => {
  const { priorityCriteria, setPriorityCriteria } = useData();
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const presetProfiles: PresetProfile[] = [
    {
      id: 'balanced',
      name: 'Balanced Approach',
      description: 'Equal consideration for all factors',
      icon: <Sliders className="w-5 h-5" />,
      weights: { '1': 20, '2': 20, '3': 20, '4': 20, '5': 20 },
      color: 'bg-blue-500'
    },
    {
      id: 'priority-focused',
      name: 'Priority Focused',
      description: 'Emphasize client priority levels',
      icon: <TrendingUp className="w-5 h-5" />,
      weights: { '1': 40, '2': 25, '3': 15, '4': 15, '5': 5 },
      color: 'bg-red-500'
    },
    {
      id: 'efficiency-first',
      name: 'Efficiency First',
      description: 'Maximize resource utilization',
      icon: <Zap className="w-5 h-5" />,
      weights: { '1': 15, '2': 20, '3': 40, '4': 15, '5': 10 },
      color: 'bg-yellow-500'
    },
    {
      id: 'fairness-oriented',
      name: 'Fairness Oriented',
      description: 'Ensure equal distribution',
      icon: <Shield className="w-5 h-5" />,
      weights: { '1': 20, '2': 15, '3': 15, '4': 35, '5': 15 },
      color: 'bg-green-500'
    },
    {
      id: 'speed-optimized',
      name: 'Speed Optimized',
      description: 'Minimize completion time',
      icon: <Clock className="w-5 h-5" />,
      weights: { '1': 15, '2': 20, '3': 20, '4': 10, '5': 35 },
      color: 'bg-purple-500'
    }
  ];

  const handleWeightChange = (criteriaId: string, newWeight: number) => {
    const updated = priorityCriteria.map((criteria: PriorityCriteria) => 
      criteria.id === criteriaId 
        ? { ...criteria, weight: newWeight }
        : criteria
    );
    setPriorityCriteria(updated);
    setHasChanges(true);
    setActiveProfile(null);
  };

  const applyPreset = (profile: PresetProfile) => {
    const updated = priorityCriteria.map((criteria: PriorityCriteria, index: number) => ({
      ...criteria,
      weight: profile.weights[criteria.id] || Object.values(profile.weights)[index] || 20
    }));
    setPriorityCriteria(updated);
    setActiveProfile(profile.id);
    setHasChanges(true);
  };

  const resetToDefault = () => {
    setPriorityCriteria([
      { id: '1', name: 'Priority Level', weight: 25, description: 'Client priority level (1-5)' },
      { id: '2', name: 'Task Fulfillment', weight: 30, description: 'Percentage of requested tasks fulfilled' },
      { id: '3', name: 'Resource Efficiency', weight: 20, description: 'Optimal use of worker capacity' },
      { id: '4', name: 'Fairness', weight: 15, description: 'Equal distribution across clients' },
      { id: '5', name: 'Speed', weight: 10, description: 'Minimize overall completion time' }
    ]);
    setActiveProfile(null);
    setHasChanges(false);
  };

  const getCriteriaIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'priority level': return <TrendingUp className="w-5 h-5" />;
      case 'task fulfillment': return <Target className="w-5 h-5" />;
      case 'resource efficiency': return <Zap className="w-5 h-5" />;
      case 'fairness': return <Users className="w-5 h-5" />;
      case 'speed': return <Clock className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const totalWeight = priorityCriteria.reduce((sum, criteria) => sum + criteria.weight, 0);
  const isValidWeights = Math.abs(totalWeight - 100) < 0.1;

  const exportConfiguration = () => {
    const config = {
      priorityCriteria: priorityCriteria,
      timestamp: new Date().toISOString(),
      profile: activeProfile || 'custom'
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'priority-weights-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Priority & Weights Configuration</h2>
          <p className="text-gray-600 mt-1">
            Set the relative importance of different criteria for resource allocation.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportConfiguration}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Config</span>
          </button>
          <button
            onClick={resetToDefault}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Weight Summary */}
      <div className={`p-4 rounded-lg border-2 ${
        isValidWeights 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className={`w-6 h-6 ${
              isValidWeights ? 'text-green-500' : 'text-red-500'
            }`} />
            <div>
              <h3 className={`font-semibold ${
                isValidWeights ? 'text-green-900' : 'text-red-900'
              }`}>
                Total Weight: {totalWeight.toFixed(1)}%
              </h3>
              <p className={`text-sm ${
                isValidWeights ? 'text-green-700' : 'text-red-700'
              }`}>
                {isValidWeights 
                  ? 'Weights are properly balanced' 
                  : 'Weights should total 100%'
                }
              </p>
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center space-x-2 text-blue-600">
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">Unsaved Changes</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Profiles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Presets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {presetProfiles.map((profile) => (
            <motion.button
              key={profile.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => applyPreset(profile)}
              className={`p-4 text-left rounded-lg border-2 transition-all ${
                activeProfile === profile.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 ${profile.color} text-white rounded-lg`}>
                  {profile.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{profile.name}</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">{profile.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Individual Criteria Sliders */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Fine-tune Weights</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {priorityCriteria.map((criteria, index) => (
            <motion.div
              key={criteria.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {getCriteriaIcon(criteria.name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{criteria.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {criteria.weight}
                      </span>
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{criteria.description}</p>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={criteria.weight}
                        onChange={(e) => handleWeightChange(criteria.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${criteria.weight}%, #E5E7EB ${criteria.weight}%, #E5E7EB 100%)`
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Low Priority</span>
                      <span>High Priority</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleWeightChange(criteria.id, Math.max(0, criteria.weight - 5))}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleWeightChange(criteria.id, Math.min(100, criteria.weight + 5))}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                      >
                        +5
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={criteria.weight}
                        onChange={(e) => handleWeightChange(criteria.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Visual Weight Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Distribution Visualization</h3>
        
        <div className="space-y-4">
          {/* Stacked Bar Chart */}
          <div className="h-8 bg-gray-200 rounded-lg overflow-hidden flex">
            {priorityCriteria.map((criteria, index) => {
              const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];
              return (
                <div
                  key={criteria.id}
                  className={`${colors[index % colors.length]} transition-all duration-300`}
                  style={{ width: `${(criteria.weight / totalWeight) * 100}%` }}
                  title={`${criteria.name}: ${criteria.weight}%`}
                />
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {priorityCriteria.map((criteria, index) => {
              const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];
              return (
                <div key={criteria.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${colors[index % colors.length]} rounded`} />
                  <span className="text-sm text-gray-700">{criteria.name}</span>
                  <span className="text-sm font-medium text-gray-900">({criteria.weight}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Impact Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-4">
          <Target className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact Preview</h3>
            <p className="text-gray-700 mb-3">
              With these weight settings, the allocation algorithm will:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Prioritize {priorityCriteria.reduce((max, curr) => curr.weight > max.weight ? curr : max).name.toLowerCase()} ({priorityCriteria.reduce((max, curr) => curr.weight > max.weight ? curr : max).weight}% weight)</li>
              <li>• Consider fairness with {priorityCriteria.find(c => c.name.toLowerCase().includes('fairness'))?.weight || 0}% influence</li>
              <li>• Balance efficiency and speed with {(priorityCriteria.find(c => c.name.toLowerCase().includes('efficiency'))?.weight || 0) + (priorityCriteria.find(c => c.name.toLowerCase().includes('speed'))?.weight || 0)}% combined weight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityWeightsManager;
