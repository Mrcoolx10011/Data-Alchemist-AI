import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Client {
  ClientID: string;
  ClientName: string;
  PriorityLevel: number;
  RequestedTaskIDs: string;
  GroupTag: string;
  AttributesJSON: string;
}

export interface Worker {
  WorkerID: string;
  WorkerName: string;
  Skills: string;
  AvailableSlots: string;
  MaxLoadPerPhase: number;
  WorkerGroup: string;
  QualificationLevel: string;
}

export interface Task {
  TaskID: string;
  TaskName: string;
  Category: string;
  Duration: number;
  RequiredSkills: string;
  PreferredPhases: string;
  MaxConcurrent: number;
}

export interface ValidationError {
  id: string;
  type: 'error' | 'warning';
  entity: 'clients' | 'workers' | 'tasks';
  entityId: string;
  field: string;
  message: string;
  suggestion?: string;
}

export interface BusinessRule {
  id: string;
  type: 'coRun' | 'slotRestriction' | 'loadLimit' | 'phaseWindow' | 'patternMatch' | 'precedence';
  name: string;
  description: string;
  config: any;
  active: boolean;
}

export interface PriorityCriteria {
  id: string;
  name: string;
  weight: number;
  description: string;
}

interface DataContextType {
  // Data entities
  clients: Client[];
  workers: Worker[];
  tasks: Task[];
  setClients: (clients: Client[]) => void;
  setWorkers: (workers: Worker[]) => void;
  setTasks: (tasks: Task[]) => void;
  
  // Validation
  validationErrors: ValidationError[];
  setValidationErrors: (errors: ValidationError[]) => void;
  runValidation: () => void;
  
  // Business Rules
  businessRules: BusinessRule[];
  setBusinessRules: (rules: BusinessRule[]) => void;
  addBusinessRule: (rule: BusinessRule) => void;
  removeBusinessRule: (ruleId: string) => void;
  
  // Prioritization
  priorityCriteria: PriorityCriteria[];
  setPriorityCriteria: (criteria: PriorityCriteria[]) => void;
  
  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  selectedEntity: 'clients' | 'workers' | 'tasks' | null;
  setSelectedEntity: (entity: 'clients' | 'workers' | 'tasks' | null) => void;
  
  // AI Features
  nlQuery: string;
  setNlQuery: (query: string) => void;
  aiSuggestions: string[];
  setAiSuggestions: (suggestions: string[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [businessRules, setBusinessRules] = useState<BusinessRule[]>([]);
  const [priorityCriteria, setPriorityCriteria] = useState<PriorityCriteria[]>([
    { id: '1', name: 'Priority Level', weight: 25, description: 'Client priority level (1-5)' },
    { id: '2', name: 'Task Fulfillment', weight: 30, description: 'Percentage of requested tasks fulfilled' },
    { id: '3', name: 'Resource Efficiency', weight: 20, description: 'Optimal use of worker capacity' },
    { id: '4', name: 'Fairness', weight: 15, description: 'Equal distribution across clients' },
    { id: '5', name: 'Speed', weight: 10, description: 'Minimize overall completion time' }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<'clients' | 'workers' | 'tasks' | null>(null);
  const [nlQuery, setNlQuery] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const runValidation = () => {
    const errors: ValidationError[] = [];
    
    // Validate clients
    clients.forEach(client => {
      // Priority level validation
      if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
        errors.push({
          id: `${client.ClientID}-priority`,
          type: 'error',
          entity: 'clients',
          entityId: client.ClientID,
          field: 'PriorityLevel',
          message: 'Priority level must be between 1 and 5',
          suggestion: 'Set priority level to a value between 1-5'
        });
      }
      
      // Check requested task IDs exist
      const requestedTasks = client.RequestedTaskIDs.split(';').filter(id => id.trim());
      requestedTasks.forEach(taskId => {
        if (!tasks.find(task => task.TaskID === taskId.trim())) {
          errors.push({
            id: `${client.ClientID}-task-${taskId}`,
            type: 'error',
            entity: 'clients',
            entityId: client.ClientID,
            field: 'RequestedTaskIDs',
            message: `Referenced task ${taskId} does not exist`,
            suggestion: `Remove ${taskId} or add it to tasks data`
          });
        }
      });
      
      // Validate JSON
      try {
        JSON.parse(client.AttributesJSON);
      } catch {
        errors.push({
          id: `${client.ClientID}-json`,
          type: 'error',
          entity: 'clients',
          entityId: client.ClientID,
          field: 'AttributesJSON',
          message: 'Invalid JSON format',
          suggestion: 'Fix JSON syntax'
        });
      }
    });
    
    // Validate workers
    workers.forEach(worker => {
      // MaxLoadPerPhase validation
      if (worker.MaxLoadPerPhase < 1) {
        errors.push({
          id: `${worker.WorkerID}-load`,
          type: 'error',
          entity: 'workers',
          entityId: worker.WorkerID,
          field: 'MaxLoadPerPhase',
          message: 'Max load per phase must be at least 1',
          suggestion: 'Set max load to a positive number'
        });
      }
      
      // Available slots validation
      try {
        const slots = JSON.parse(worker.AvailableSlots);
        if (!Array.isArray(slots)) {
          throw new Error('Not an array');
        }
        slots.forEach(slot => {
          if (typeof slot !== 'number' || slot < 1) {
            throw new Error('Invalid slot');
          }
        });
      } catch {
        errors.push({
          id: `${worker.WorkerID}-slots`,
          type: 'error',
          entity: 'workers',
          entityId: worker.WorkerID,
          field: 'AvailableSlots',
          message: 'Available slots must be a valid array of positive numbers',
          suggestion: 'Format as [1,2,3,4,5]'
        });
      }
    });
    
    // Validate tasks
    tasks.forEach(task => {
      // Duration validation
      if (task.Duration < 1) {
        errors.push({
          id: `${task.TaskID}-duration`,
          type: 'error',
          entity: 'tasks',
          entityId: task.TaskID,
          field: 'Duration',
          message: 'Duration must be at least 1',
          suggestion: 'Set duration to a positive number'
        });
      }
      
      // MaxConcurrent validation
      if (task.MaxConcurrent < 1) {
        errors.push({
          id: `${task.TaskID}-concurrent`,
          type: 'error',
          entity: 'tasks',
          entityId: task.TaskID,
          field: 'MaxConcurrent',
          message: 'Max concurrent must be at least 1',
          suggestion: 'Set max concurrent to a positive number'
        });
      }
      
      // Skill coverage check
      const requiredSkills = task.RequiredSkills.split(';').map(s => s.trim());
      const availableSkills = workers.flatMap(w => w.Skills.split(';').map(s => s.trim()));
      
      requiredSkills.forEach(skill => {
        if (!availableSkills.includes(skill)) {
          errors.push({
            id: `${task.TaskID}-skill-${skill}`,
            type: 'warning',
            entity: 'tasks',
            entityId: task.TaskID,
            field: 'RequiredSkills',
            message: `No workers have skill: ${skill}`,
            suggestion: `Add workers with ${skill} skill or remove from requirements`
          });
        }
      });
    });
    
    // Check for duplicate IDs
    const clientIds = clients.map(c => c.ClientID);
    const workerIds = workers.map(w => w.WorkerID);
    const taskIds = tasks.map(t => t.TaskID);
    
    const duplicateClients = clientIds.filter((id, index) => clientIds.indexOf(id) !== index);
    const duplicateWorkers = workerIds.filter((id, index) => workerIds.indexOf(id) !== index);
    const duplicateTasks = taskIds.filter((id, index) => taskIds.indexOf(id) !== index);
    
    duplicateClients.forEach(id => {
      errors.push({
        id: `duplicate-client-${id}`,
        type: 'error',
        entity: 'clients',
        entityId: id,
        field: 'ClientID',
        message: `Duplicate ClientID: ${id}`,
        suggestion: 'Ensure all ClientIDs are unique'
      });
    });
    
    duplicateWorkers.forEach(id => {
      errors.push({
        id: `duplicate-worker-${id}`,
        type: 'error',
        entity: 'workers',
        entityId: id,
        field: 'WorkerID',
        message: `Duplicate WorkerID: ${id}`,
        suggestion: 'Ensure all WorkerIDs are unique'
      });
    });
    
    duplicateTasks.forEach(id => {
      errors.push({
        id: `duplicate-task-${id}`,
        type: 'error',
        entity: 'tasks',
        entityId: id,
        field: 'TaskID',
        message: `Duplicate TaskID: ${id}`,
        suggestion: 'Ensure all TaskIDs are unique'
      });
    });
    
    setValidationErrors(errors);
  };

  const addBusinessRule = (rule: BusinessRule) => {
    setBusinessRules(prev => [...prev, rule]);
  };

  const removeBusinessRule = (ruleId: string) => {
    setBusinessRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  return (
    <DataContext.Provider value={{
      clients,
      workers,
      tasks,
      setClients,
      setWorkers,
      setTasks,
      validationErrors,
      setValidationErrors,
      runValidation,
      businessRules,
      setBusinessRules,
      addBusinessRule,
      removeBusinessRule,
      priorityCriteria,
      setPriorityCriteria,
      isLoading,
      setIsLoading,
      selectedEntity,
      setSelectedEntity,
      nlQuery,
      setNlQuery,
      aiSuggestions,
      setAiSuggestions
    }}>
      {children}
    </DataContext.Provider>
  );
};