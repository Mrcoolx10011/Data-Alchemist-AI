import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileText,
  Users,
  Briefcase,
  Brain,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useData, Client, Worker, Task } from '../context/DataContext';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  data?: any[];
  preview?: any[];
  entityType?: 'clients' | 'workers' | 'tasks';
  aiMappingScore?: number;
}

const DataUpload: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  
  const { 
    clients, workers, tasks, 
    setClients, setWorkers, setTasks,
    runValidation, validationErrors,
    setIsLoading 
  } = useData();

  // AI-enabled column mapping
  const aiMapColumns = (headers: string[], entityType: 'clients' | 'workers' | 'tasks') => {
    const mappings = {
      clients: {
        'ClientID': ['client_id', 'clientid', 'id', 'client', 'customer_id'],
        'ClientName': ['client_name', 'clientname', 'name', 'customer_name', 'company'],
        'PriorityLevel': ['priority', 'priority_level', 'level', 'importance'],
        'RequestedTaskIDs': ['requested_tasks', 'tasks', 'task_ids', 'requested_task_ids'],
        'GroupTag': ['group', 'tag', 'group_tag', 'category'],
        'AttributesJSON': ['attributes', 'metadata', 'extra', 'json', 'details']
      },
      workers: {
        'WorkerID': ['worker_id', 'workerid', 'id', 'employee_id', 'staff_id'],
        'WorkerName': ['worker_name', 'workername', 'name', 'employee_name', 'full_name'],
        'Skills': ['skills', 'skill', 'competencies', 'abilities'],
        'AvailableSlots': ['available_slots', 'slots', 'availability', 'phases'],
        'MaxLoadPerPhase': ['max_load', 'load', 'capacity', 'max_capacity'],
        'WorkerGroup': ['group', 'team', 'department', 'worker_group'],
        'QualificationLevel': ['qualification', 'level', 'seniority', 'experience']
      },
      tasks: {
        'TaskID': ['task_id', 'taskid', 'id', 'task'],
        'TaskName': ['task_name', 'taskname', 'name', 'title'],
        'Category': ['category', 'type', 'classification'],
        'Duration': ['duration', 'time', 'phases', 'length'],
        'RequiredSkills': ['required_skills', 'skills', 'requirements'],
        'PreferredPhases': ['preferred_phases', 'phases', 'schedule'],
        'MaxConcurrent': ['max_concurrent', 'concurrent', 'parallel', 'max_parallel']
      }
    };

    const entityMappings = mappings[entityType];
    const mapped: Record<string, string> = {};
    let score = 0;

    Object.keys(entityMappings).forEach(standardField => {
      const alternatives = entityMappings[standardField as keyof typeof entityMappings] as string[];
      const matchedHeader = headers.find(header => 
        alternatives && alternatives.some((alt: string) => 
          header.toLowerCase().includes(alt) || alt.includes(header.toLowerCase())
        )
      );
      
      if (matchedHeader) {
        mapped[matchedHeader] = standardField;
        score += 1;
      }
    });

    return { 
      mapping: mapped, 
      score: (score / Object.keys(entityMappings).length) * 100 
    };
  };

  // Smart entity type detection
  const detectEntityType = (headers: string[]): 'clients' | 'workers' | 'tasks' => {
    const clientScore = aiMapColumns(headers, 'clients').score;
    const workerScore = aiMapColumns(headers, 'workers').score;
    const taskScore = aiMapColumns(headers, 'tasks').score;

    if (clientScore >= workerScore && clientScore >= taskScore) return 'clients';
    if (workerScore >= taskScore) return 'workers';
    return 'tasks';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAiProcessing(true);
    
    acceptedFiles.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading'
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      setTimeout(() => {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, status: 'processing' } : f)
        );

        // Parse file based on type
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          Papa.parse(file, {
            header: true,
            complete: (results) => {
              processFileData(fileId, results.data.slice(0, -1), Object.keys(results.data[0] || {}));
            },
            error: () => handleFileError(fileId)
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const data = e.target?.result;
              const workbook = XLSX.read(data, { type: 'binary' });
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              
              if (jsonData.length > 0) {
                processFileData(fileId, jsonData, Object.keys(jsonData[0] as object));
              } else {
                handleFileError(fileId);
              }
            } catch {
              handleFileError(fileId);
            }
          };
          reader.readAsBinaryString(file);
        } else {
          handleFileError(fileId);
        }
      }, 1000);
    });

    setTimeout(() => setAiProcessing(false), 2000);
  }, []);

  const processFileData = (fileId: string, data: any[], headers: string[]) => {
    // AI-powered entity detection and column mapping
    const entityType = detectEntityType(headers);
    const { mapping, score } = aiMapColumns(headers, entityType);
    
    // Transform data using AI mapping
    const transformedData = data.map(row => {
      const transformed: any = {};
      Object.keys(row).forEach(originalKey => {
        const mappedKey = mapping[originalKey] || originalKey;
        transformed[mappedKey] = row[originalKey];
      });
      return transformed;
    });

    const preview = transformedData.slice(0, 5);
    
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { 
        ...f, 
        status: 'completed',
        data: transformedData,
        preview: preview,
        entityType,
        aiMappingScore: score
      } : f)
    );
  };

  const handleFileError = (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, status: 'error' } : f)
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const applyDataToEntity = (file: UploadedFile) => {
    if (!file.data || !file.entityType) return;

    setIsLoading(true);
    
    try {
      switch (file.entityType) {
        case 'clients':
          setClients(file.data as Client[]);
          break;
        case 'workers':
          setWorkers(file.data as Worker[]);
          break;
        case 'tasks':
          setTasks(file.data as Task[]);
          break;
      }
      
      // Run validation after setting data
      setTimeout(() => {
        runValidation();
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error applying data:', error);
      setIsLoading(false);
    }
  };

  // Sample data loading removed - app now works with uploaded data only

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'clients': return Users;
      case 'workers': return Briefcase;
      case 'tasks': return FileText;
      default: return File;
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'clients': return 'from-blue-500 to-blue-600';
      case 'workers': return 'from-green-500 to-green-600';
      case 'tasks': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4 md:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 md:p-3 rounded-lg">
              <Upload className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Data Ingestion Hub</h1>
              <p className="text-sm md:text-base text-gray-600">Upload CSV or Excel files with AI-powered parsing</p>
            </div>
          </div>
        </div>

        {/* AI Processing Indicator - Mobile Optimized */}
        <AnimatePresence>
          {aiProcessing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-blue-600 animate-spin flex-shrink-0" />
                <span className="text-sm md:text-base text-blue-800 font-medium">AI analyzing file structure and mapping columns...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Validation Summary - Mobile Optimized */}
        {validationErrors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 md:p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
              <span className="text-sm md:text-base font-semibold text-red-800">
                {validationErrors.filter(e => e.type === 'error').length} Errors, {validationErrors.filter(e => e.type === 'warning').length} Warnings
              </span>
            </div>
            <div className="text-xs md:text-sm text-red-700">
              Fix validation issues before proceeding with rule configuration.
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Upload Area - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div
          {...getRootProps()}
          className={`p-6 md:p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
            isDragActive 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <div className={`mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 ${
              isDragActive ? 'bg-indigo-100' : 'bg-gray-100'
            }`}>
              <Upload className={`h-6 w-6 md:h-8 md:w-8 ${isDragActive ? 'text-indigo-600' : 'text-gray-600'}`} />
            </div>
            
            {isDragActive ? (
              <p className="text-base md:text-lg text-indigo-600 font-medium">Drop files here to upload</p>
            ) : (
              <div>
                <p className="text-base md:text-lg text-gray-600 mb-2">
                  Drop your CSV or Excel files here, or <span className="text-indigo-600 font-medium">browse</span>
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Supports: clients.csv, workers.csv, tasks.csv, .xlsx files
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Uploaded Files</h2>
          
          <div className="space-y-4">
            {uploadedFiles.map((file) => {
              const EntityIcon = getEntityIcon(file.entityType || '');
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getEntityColor(file.entityType || '')}`}>
                        <EntityIcon className="h-5 w-5 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{file.name}</h3>
                          {file.status === 'completed' && file.entityType && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {file.entityType}
                            </span>
                          )}
                          {file.aiMappingScore && file.aiMappingScore > 80 && (
                            <div className="flex items-center space-x-1">
                              <Brain className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">
                                AI Mapped ({Math.round(file.aiMappingScore)}%)
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB
                          {file.data && ` • ${file.data.length} rows`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {file.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      )}
                      
                      {file.status === 'processing' && (
                        <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
                      )}
                      
                      {file.status === 'completed' && (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <button
                            onClick={() => applyDataToEntity(file)}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Apply Data
                          </button>
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Preview
                          </button>
                        </>
                      )}
                      
                      {file.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* File Preview */}
                  {selectedFile?.id === file.id && file.preview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">Data Preview</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              {file.preview[0] && Object.keys(file.preview[0]).map((key) => (
                                <th key={key} className="px-3 py-2 text-left font-medium text-gray-600">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {file.preview.map((row, index) => (
                              <tr key={index} className="border-t border-gray-100">
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="px-3 py-2 text-gray-900">
                                    {String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Data Summary */}
      {(clients.length > 0 || workers.length > 0 || tasks.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Data Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Clients</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{clients.length}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Workers</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{workers.length}</p>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-800">Tasks</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{tasks.length}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataUpload;