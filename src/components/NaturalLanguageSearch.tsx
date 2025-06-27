import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  X, 
  ChevronDown, 
  Users, 
  Briefcase, 
  User,
  Brain,
  Lightbulb,
  Database
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface SearchResult {
  id: string;
  entity: 'clients' | 'workers' | 'tasks';
  data: any;
  relevanceScore: number;
  matchingFields: string[];
}

const NaturalLanguageSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<'all' | 'clients' | 'workers' | 'tasks'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const { clients, workers, tasks } = useData();
  const inputRef = useRef<HTMLInputElement>(null);

  const searchSuggestions = [
    "Show all tasks that require Python skills and have duration more than 2 phases",
    "Find workers with Machine Learning skills available in phase 1 and 3",
    "List high priority clients (level 4 or 5) requesting AI development tasks",
    "Show tasks in Development category with maximum concurrent workers less than 3",
    "Find workers in AI-Team group with Senior qualification level",
    "Display clients from Enterprise group with budget above 50000",
    "Show all tasks that prefer phases 2-4 and require Design skills",
    "Find available workers who can work in phases 1, 2, and 3",
    "List tasks with duration of 1 phase that require Testing skills",
    "Show clients requesting more than 3 different tasks"
  ];

  // AI-powered natural language processing
  const processNaturalLanguageQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Extract key parameters from the query
    const extractors = {
      // Skills extraction
      skills: /(?:skill[s]?\s+(?:in|with|including|containing)?\s*[:\-]?\s*)([a-z\s,;\/&\-]+?)(?=\s+(?:and|or|with|in|for|that|having|where)|$)/gi,
      
      // Duration extraction
      duration: /(?:duration|time|phases?)\s*(?:of|is|equals?|[><=]+|more\s+than|less\s+than|greater\s+than|at\s+least|exactly)\s*(\d+)/gi,
      
      // Priority extraction
      priority: /(?:priority|level)\s*(?:of|is|equals?|[><=]+|more\s+than|less\s+than|greater\s+than|at\s+least|exactly)\s*(\d+)/gi,
      
      // Phase extraction
      phases: /(?:phase[s]?|available\s+in)\s*(?:in|during|at)?\s*[\[\(]?(\d+(?:[,;\s]+\d+)*|\d+\-\d+)[\]\)]?/gi,
      
      // Category extraction
      category: /(?:category|type)\s*(?:is|equals?|of)?\s*[:\-]?\s*([a-z\s]+?)(?=\s+(?:and|or|with|in|for|that|having|where)|$)/gi,
      
      // Group extraction
      group: /(?:group|team|department)\s*(?:is|equals?|of)?\s*[:\-]?\s*([a-z\s\-]+?)(?=\s+(?:and|or|with|in|for|that|having|where)|$)/gi,
      
      // Qualification extraction
      qualification: /(?:qualification|level|seniority)\s*(?:is|equals?|of)?\s*[:\-]?\s*([a-z\s]+?)(?=\s+(?:and|or|with|in|for|that|having|where)|$)/gi,
      
      // Comparison operators
      operators: {
        greaterThan: /(?:more\s+than|greater\s+than|above|[>])\s*(\d+)/gi,
        lessThan: /(?:less\s+than|below|under|[<])\s*(\d+)/gi,
        equalTo: /(?:exactly|equals?|is)\s*(\d+)/gi,
        atLeast: /(?:at\s+least|minimum\s+of|\>=)\s*(\d+)/gi
      }
    };

    // Search clients
    if (selectedEntity === 'all' || selectedEntity === 'clients') {
      clients.forEach((client, index) => {
        let relevanceScore = 0;
        const matchingFields: string[] = [];

        // Check each field for matches
        Object.entries(client).forEach(([field, value]) => {
          const stringValue = String(value).toLowerCase();
          
          if (stringValue.includes(lowerQuery) || lowerQuery.includes(stringValue)) {
            relevanceScore += 10;
            matchingFields.push(field);
          }
        });

        // Advanced matching based on extracted parameters
        if (lowerQuery.includes('priority') || lowerQuery.includes('level')) {
          const priorityMatch = extractors.priority.exec(lowerQuery);
          if (priorityMatch) {
            const targetPriority = parseInt(priorityMatch[1]);
            if (lowerQuery.includes('high') && client.PriorityLevel >= 4) {
              relevanceScore += 15;
              matchingFields.push('PriorityLevel');
            } else if (lowerQuery.includes('low') && client.PriorityLevel <= 2) {
              relevanceScore += 15;
              matchingFields.push('PriorityLevel');
            } else if (client.PriorityLevel === targetPriority) {
              relevanceScore += 15;
              matchingFields.push('PriorityLevel');
            }
          }
        }

        // Check for task requirements
        if (lowerQuery.includes('task') && client.RequestedTaskIDs) {
          const requestedTasks = client.RequestedTaskIDs.split(';');
          if (lowerQuery.includes('more than') || lowerQuery.includes('>')) {
            const match = /(?:more\s+than|>)\s*(\d+)/.exec(lowerQuery);
            if (match && requestedTasks.length > parseInt(match[1])) {
              relevanceScore += 12;
              matchingFields.push('RequestedTaskIDs');
            }
          }
        }

        // Check group tags
        if (lowerQuery.includes('enterprise') && client.GroupTag.toLowerCase().includes('enterprise')) {
          relevanceScore += 10;
          matchingFields.push('GroupTag');
        }

        if (relevanceScore > 0) {
          results.push({
            id: `client-${index}`,
            entity: 'clients',
            data: client,
            relevanceScore,
            matchingFields
          });
        }
      });
    }

    // Search workers
    if (selectedEntity === 'all' || selectedEntity === 'workers') {
      workers.forEach((worker, index) => {
        let relevanceScore = 0;
        const matchingFields: string[] = [];

        // Basic text matching
        Object.entries(worker).forEach(([field, value]) => {
          const stringValue = String(value).toLowerCase();
          
          if (stringValue.includes(lowerQuery) || lowerQuery.includes(stringValue)) {
            relevanceScore += 10;
            matchingFields.push(field);
          }
        });

        // Skills matching
        const skillsMatch = extractors.skills.exec(lowerQuery);
        if (skillsMatch || lowerQuery.includes('skill')) {
          const workerSkills = worker.Skills.toLowerCase().split(';').map(s => s.trim());
          const queryTerms = lowerQuery.split(/\s+/);
          
          queryTerms.forEach(term => {
            workerSkills.forEach(skill => {
              if (skill.includes(term) || term.includes(skill)) {
                relevanceScore += 8;
                if (!matchingFields.includes('Skills')) {
                  matchingFields.push('Skills');
                }
              }
            });
          });
        }

        // Phase availability matching
        if (lowerQuery.includes('phase') || lowerQuery.includes('available')) {
          try {
            const availableSlots = JSON.parse(worker.AvailableSlots);
            const phaseMatch = extractors.phases.exec(lowerQuery);
            
            if (phaseMatch) {
              const queryPhases = phaseMatch[1].split(/[,;\s\-]+/).map(p => parseInt(p.trim()));
              const hasMatchingPhases = queryPhases.some(phase => availableSlots.includes(phase));
              
              if (hasMatchingPhases) {
                relevanceScore += 12;
                matchingFields.push('AvailableSlots');
              }
            }
          } catch {
            // Handle parsing errors
          }
        }

        // Group matching
        if (lowerQuery.includes('team') || lowerQuery.includes('group')) {
          const groupMatch = extractors.group.exec(lowerQuery);
          if (groupMatch && worker.WorkerGroup.toLowerCase().includes(groupMatch[1].toLowerCase())) {
            relevanceScore += 10;
            matchingFields.push('WorkerGroup');
          }
        }

        // Qualification matching
        if (lowerQuery.includes('senior') && worker.QualificationLevel.toLowerCase().includes('senior')) {
          relevanceScore += 8;
          matchingFields.push('QualificationLevel');
        }

        if (relevanceScore > 0) {
          results.push({
            id: `worker-${index}`,
            entity: 'workers',
            data: worker,
            relevanceScore,
            matchingFields
          });
        }
      });
    }

    // Search tasks
    if (selectedEntity === 'all' || selectedEntity === 'tasks') {
      tasks.forEach((task, index) => {
        let relevanceScore = 0;
        const matchingFields: string[] = [];

        // Basic text matching
        Object.entries(task).forEach(([field, value]) => {
          const stringValue = String(value).toLowerCase();
          
          if (stringValue.includes(lowerQuery) || lowerQuery.includes(stringValue)) {
            relevanceScore += 10;
            matchingFields.push(field);
          }
        });

        // Duration matching
        const durationMatch = extractors.duration.exec(lowerQuery);
        if (durationMatch) {
          const targetDuration = parseInt(durationMatch[1]);
          
          if (lowerQuery.includes('more than') || lowerQuery.includes('>')) {
            if (task.Duration > targetDuration) {
              relevanceScore += 15;
              matchingFields.push('Duration');
            }
          } else if (lowerQuery.includes('less than') || lowerQuery.includes('<')) {
            if (task.Duration < targetDuration) {
              relevanceScore += 15;
              matchingFields.push('Duration');
            }
          } else if (task.Duration === targetDuration) {
            relevanceScore += 15;
            matchingFields.push('Duration');
          }
        }

        // Skills matching
        if (lowerQuery.includes('skill') || lowerQuery.includes('require')) {
          const taskSkills = task.RequiredSkills.toLowerCase().split(';').map(s => s.trim());
          const queryTerms = lowerQuery.split(/\s+/);
          
          queryTerms.forEach(term => {
            taskSkills.forEach(skill => {
              if (skill.includes(term) || term.includes(skill)) {
                relevanceScore += 8;
                if (!matchingFields.includes('RequiredSkills')) {
                  matchingFields.push('RequiredSkills');
                }
              }
            });
          });
        }

        // Category matching
        if (lowerQuery.includes('development') && task.Category.toLowerCase().includes('development')) {
          relevanceScore += 10;
          matchingFields.push('Category');
        }

        // MaxConcurrent matching
        if (lowerQuery.includes('concurrent') || lowerQuery.includes('parallel')) {
          const concurrentMatch = /(?:concurrent|parallel).*?(?:less\s+than|<)\s*(\d+)/gi.exec(lowerQuery);
          if (concurrentMatch && task.MaxConcurrent < parseInt(concurrentMatch[1])) {
            relevanceScore += 12;
            matchingFields.push('MaxConcurrent');
          }
        }

        if (relevanceScore > 0) {
          results.push({
            id: `task-${index}`,
            entity: 'tasks',
            data: task,
            relevanceScore,
            matchingFields
          });
        }
      });
    }

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);

    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      return updated;
    });

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const results = processNaturalLanguageQuery(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getEntityIcon = (entity: 'clients' | 'workers' | 'tasks') => {
    switch (entity) {
      case 'clients': return <Users className="w-4 h-4" />;
      case 'workers': return <User className="w-4 h-4" />;
      case 'tasks': return <Briefcase className="w-4 h-4" />;
    }
  };

  const getEntityColor = (entity: 'clients' | 'workers' | 'tasks') => {
    switch (entity) {
      case 'clients': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'workers': return 'text-green-600 bg-green-50 border-green-200';
      case 'tasks': return 'text-purple-600 bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold text-gray-900">AI-Powered Search</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Search your data using natural language. Ask complex questions and get intelligent results.
        </p>
      </div>

      {/* Search Interface */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="flex items-center space-x-4 bg-white rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors p-4 shadow-lg">
            {/* Entity Filter */}
            <div className="relative">
              <select
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value as any)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Data</option>
                <option value="clients">Clients</option>
                <option value="workers">Workers</option>
                <option value="tasks">Tasks</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Ask me anything about your data... e.g., 'Show workers with Python skills available in phase 1'"
                className="w-full text-lg bg-transparent border-none outline-none placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSearching ? (
                <Sparkles className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{isSearching ? 'Searching...' : 'Search'}</span>
            </button>
          </div>

          {/* Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && (query.length === 0 || query.length < 3) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-medium text-gray-900">Try these example searches:</h3>
                  </div>
                  <div className="space-y-2">
                    {searchSuggestions.slice(0, 6).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(suggestion);
                          setShowSuggestions(false);
                          setTimeout(() => handleSearch(), 100);
                        }}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                      >
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                  
                  {recentSearches.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Recent Searches:</h4>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setQuery(search);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Search Results
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Found {searchResults.length} relevant {searchResults.length === 1 ? 'result' : 'results'} for "{query}"
                    </p>
                  </div>
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${getEntityColor(result.entity)} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getEntityIcon(result.entity)}
                          <span className="text-sm font-medium uppercase tracking-wider">
                            {result.entity.slice(0, -1)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {Math.round(result.relevanceScore)}% match
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(result.data).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <label className={`text-xs font-medium uppercase tracking-wider ${
                                result.matchingFields.includes(key) 
                                  ? 'text-yellow-700 bg-yellow-100 px-2 py-1 rounded' 
                                  : 'text-gray-500'
                              }`}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {query && !isSearching && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try rephrasing your search or use different keywords. You can also try one of the suggested searches above.
          </p>
        </motion.div>
      )}

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
};

export default NaturalLanguageSearch;
