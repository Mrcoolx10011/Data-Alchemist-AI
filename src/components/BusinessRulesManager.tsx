import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Save, 
  X, 
  Sparkles, 
  Brain,
  CheckCircle,
  AlertCircle,
  Users,
  Briefcase,
  Clock,
  Target,
  Zap,
  Copy
} from 'lucide-react';
import { useData, BusinessRule } from '../context/DataContext';

interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  type: BusinessRule['type'];
  template: string;
  parameters: string[];
  icon: React.ReactNode;
}

const BusinessRulesManager: React.FC = () => {
  const { businessRules, addBusinessRule, removeBusinessRule } = useData();
  const [showAddRule, setShowAddRule] = useState(false);
  const [nlInput, setNlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RuleTemplate | null>(null);
  const [parsedRule, setParsedRule] = useState<Partial<BusinessRule> | null>(null);

  const ruleTemplates: RuleTemplate[] = [
    {
      id: 'coRun',
      name: 'Co-Run Tasks',
      description: 'Ensure specific tasks run together in the same phase',
      type: 'coRun',
      template: 'Tasks {task1} and {task2} should run together',
      parameters: ['task1', 'task2'],
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'slotRestriction',
      name: 'Slot Restriction',
      description: 'Limit available slots for specific groups',
      type: 'slotRestriction',
      template: '{group} should have at least {minSlots} common slots',
      parameters: ['group', 'minSlots'],
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'loadLimit',
      name: 'Load Limit',
      description: 'Set maximum workload per phase for workers',
      type: 'loadLimit',
      template: '{workerGroup} should not exceed {maxSlots} slots per phase',
      parameters: ['workerGroup', 'maxSlots'],
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'phaseWindow',
      name: 'Phase Window',
      description: 'Restrict tasks to specific phases',
      type: 'phaseWindow',
      template: 'Task {taskId} should only run in phases {phases}',
      parameters: ['taskId', 'phases'],
      icon: <Briefcase className="w-5 h-5" />
    },
    {
      id: 'precedence',
      name: 'Task Precedence',
      description: 'Define task dependencies and order',
      type: 'precedence',
      template: 'Task {task1} must complete before {task2} can start',
      parameters: ['task1', 'task2'],
      icon: <Zap className="w-5 h-5" />
    }
  ];

  // AI Natural Language to Rule Parser
  const parseNaturalLanguageRule = async (input: string): Promise<Partial<BusinessRule> | null> => {
    const lowerInput = input.toLowerCase();
    
    // Co-run detection
    if (lowerInput.includes('together') || lowerInput.includes('same time') || lowerInput.includes('simultaneously')) {
      const taskMatches = input.match(/(?:task[s]?\s+)?([A-Z]\d+)/gi);
      if (taskMatches && taskMatches.length >= 2) {
        return {
          type: 'coRun',
          name: `Co-run ${taskMatches.join(' and ')}`,
          description: input,
          config: {
            tasks: taskMatches.map(t => t.replace(/^task\s+/i, ''))
          },
          active: true
        };
      }
    }
    
    // Load limit detection
    if (lowerInput.includes('not exceed') || lowerInput.includes('maximum') || lowerInput.includes('limit')) {
      const groupMatch = input.match(/([A-Za-z\-]+(?:\s+team|\s+group)?)/i);
      const numberMatch = input.match(/(\d+)/);
      
      if (groupMatch && numberMatch) {
        return {
          type: 'loadLimit',
          name: `Load limit for ${groupMatch[1]}`,
          description: input,
          config: {
            workerGroup: groupMatch[1],
            maxSlotsPerPhase: parseInt(numberMatch[1])
          },
          active: true
        };
      }
    }
    
    // Phase window detection
    if (lowerInput.includes('only in phase') || lowerInput.includes('restrict to phase') || lowerInput.includes('must run in')) {
      const taskMatch = input.match(/(?:task\s+)?([A-Z]\d+)/i);
      const phaseMatches = input.match(/phase[s]?\s+(\d+(?:[,\s\-and]+\d+)*)/i);
      
      if (taskMatch && phaseMatches) {
        const phases = phaseMatches[1].split(/[,\s\-and]+/).map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        return {
          type: 'phaseWindow',
          name: `Phase restriction for ${taskMatch[1]}`,
          description: input,
          config: {
            taskId: taskMatch[1],
            allowedPhases: phases
          },
          active: true
        };
      }
    }
    
    // Precedence detection
    if (lowerInput.includes('before') || lowerInput.includes('after') || lowerInput.includes('depends on')) {
      const taskMatches = input.match(/(?:task\s+)?([A-Z]\d+)/gi);
      if (taskMatches && taskMatches.length >= 2) {
        const [first, second] = taskMatches;
        return {
          type: 'precedence',
          name: `${first} before ${second}`,
          description: input,
          config: {
            prerequisite: first.replace(/^task\s+/i, ''),
            dependent: second.replace(/^task\s+/i, '')
          },
          active: true
        };
      }
    }
    
    // Slot restriction detection
    if (lowerInput.includes('common slots') || lowerInput.includes('shared availability')) {
      const groupMatch = input.match(/([A-Za-z\-]+(?:\s+team|\s+group)?)/i);
      const numberMatch = input.match(/(\d+)/);
      
      if (groupMatch && numberMatch) {
        return {
          type: 'slotRestriction',
          name: `Slot restriction for ${groupMatch[1]}`,
          description: input,
          config: {
            group: groupMatch[1],
            minCommonSlots: parseInt(numberMatch[1])
          },
          active: true
        };
      }
    }
    
    return null;
  };

  const handleNLProcessing = async () => {
    if (!nlInput.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const parsed = await parseNaturalLanguageRule(nlInput);
      if (parsed) {
        setParsedRule(parsed);
      } else {
        // If no automatic parsing, suggest manual template selection
        setParsedRule({
          type: 'patternMatch',
          name: 'Custom Rule',
          description: nlInput,
          config: { pattern: nlInput },
          active: true
        });
      }
    } catch (error) {
      console.error('Error processing natural language rule:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddRule = () => {
    if (parsedRule) {
      const rule: BusinessRule = {
        id: `rule-${Date.now()}`,
        type: parsedRule.type!,
        name: parsedRule.name!,
        description: parsedRule.description!,
        config: parsedRule.config || {},
        active: true
      };
      
      addBusinessRule(rule);
      setNlInput('');
      setParsedRule(null);
      setShowAddRule(false);
    }
  };

  const getRuleIcon = (type: BusinessRule['type']) => {
    const template = ruleTemplates.find(t => t.type === type);
    return template?.icon || <Settings className="w-5 h-5" />;
  };

  const getRuleColor = (type: BusinessRule['type']) => {
    const colors = {
      coRun: 'bg-blue-50 border-blue-200 text-blue-700',
      slotRestriction: 'bg-green-50 border-green-200 text-green-700',
      loadLimit: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      phaseWindow: 'bg-purple-50 border-purple-200 text-purple-700',
      patternMatch: 'bg-pink-50 border-pink-200 text-pink-700',
      precedence: 'bg-orange-50 border-orange-200 text-orange-700'
    };
    return colors[type] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Rules</h2>
          <p className="text-gray-600 mt-1">
            Define rules in natural language or use templates to configure business logic.
          </p>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Rule</span>
        </button>
      </div>

      {/* Existing Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {businessRules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${getRuleColor(rule.type)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {getRuleIcon(rule.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-white rounded-full font-medium uppercase tracking-wider">
                        {rule.type.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      {rule.active ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeBusinessRule(rule.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {businessRules.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Rules Defined</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-4">
            Start by adding business rules to control how resources are allocated and tasks are scheduled.
          </p>
          <button
            onClick={() => setShowAddRule(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Rule
          </button>
        </div>
      )}

      {/* Add Rule Modal */}
      <AnimatePresence>
        {showAddRule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Create Business Rule</h3>
                      <p className="text-gray-600">Use natural language or select a template</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddRule(false);
                      setNlInput('');
                      setParsedRule(null);
                      setSelectedTemplate(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Natural Language Input */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <h4 className="text-lg font-medium text-gray-900">Describe Your Rule</h4>
                  </div>
                  <div className="relative">
                    <textarea
                      value={nlInput}
                      onChange={(e) => setNlInput(e.target.value)}
                      placeholder="Describe your business rule in plain English... 

Examples:
• Tasks T001 and T003 should run together
• AI-Team should not exceed 5 slots per phase  
• Task T005 should only run in phases 2 and 3
• Task T001 must complete before T002 can start"
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                      <button
                        onClick={handleNLProcessing}
                        disabled={!nlInput.trim() || isProcessing}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                      >
                        {isProcessing ? (
                          <Sparkles className="w-4 h-4 animate-spin" />
                        ) : (
                          <Brain className="w-4 h-4" />
                        )}
                        <span>{isProcessing ? 'Processing...' : 'Parse Rule'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Parsed Rule Preview */}
                {parsedRule && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-green-900">Rule Successfully Parsed!</h5>
                        <div className="mt-2 space-y-2">
                          <div><strong>Type:</strong> {parsedRule.type}</div>
                          <div><strong>Name:</strong> {parsedRule.name}</div>
                          <div><strong>Description:</strong> {parsedRule.description}</div>
                          {parsedRule.config && (
                            <div>
                              <strong>Configuration:</strong>
                              <pre className="bg-white p-2 rounded mt-1 text-sm">
                                {JSON.stringify(parsedRule.config, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={handleAddRule}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>Add Rule</span>
                          </button>
                          <button
                            onClick={() => setParsedRule(null)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Rule Templates */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Or Choose a Template</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ruleTemplates.map((template) => (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setNlInput(template.template);
                          setSelectedTemplate(template);
                        }}
                        className={`p-4 text-left rounded-lg border-2 transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900">{template.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 p-2 rounded">
                              {template.template}
                            </p>
                          </div>
                          <Copy className="w-4 h-4 text-gray-400" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessRulesManager;
