import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  RefreshCw,
  Download,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Client, Worker, Task } from '../context/DataContext';

interface DataGridProps {
  entityType: 'clients' | 'workers' | 'tasks';
}

const DataValidationGrid: React.FC<DataGridProps> = ({ entityType }) => {
  const { 
    clients, 
    workers, 
    tasks, 
    setClients, 
    setWorkers, 
    setTasks,
    validationErrors,
    runValidation 
  } = useData();
  
  const [editingCell, setEditingCell] = useState<{row: number, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning'>('all');

  const data = useMemo(() => {
    switch (entityType) {
      case 'clients': return clients;
      case 'workers': return workers;
      case 'tasks': return tasks;
      default: return [];
    }
  }, [entityType, clients, workers, tasks]);

  // Type-safe helper to get entity ID
  const getEntityId = (row: Client | Worker | Task): string => {
    if ('ClientID' in row) return row.ClientID;
    if ('WorkerID' in row) return row.WorkerID;
    if ('TaskID' in row) return row.TaskID;
    return '';
  };

  // Type-safe helper to get field value
  const getFieldValue = (row: Client | Worker | Task, field: string): any => {
    return (row as any)[field];
  };

  // Type-safe helper to set field value
  const setFieldValue = (row: Client | Worker | Task, field: string, value: any): Client | Worker | Task => {
    return { ...row, [field]: value };
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const entityErrors = useMemo(() => {
    return validationErrors.filter(error => error.entity === entityType);
  }, [validationErrors, entityType]);

  const getFieldErrors = (rowIndex: number, field: string) => {
    const row = data[rowIndex];
    if (!row) return [];
    const entityId = getEntityId(row);
    return entityErrors.filter(error => 
      error.entityId === entityId && error.field === field
    );
  };

  const getRowErrors = (rowIndex: number) => {
    const row = data[rowIndex];
    if (!row) return [];
    const entityId = getEntityId(row);
    return entityErrors.filter(error => error.entityId === entityId);
  };

  const filteredData = useMemo(() => {
    if (filterType === 'all' && !showOnlyErrors) return data;
    
    return data.filter((_, index) => {
      const rowErrors = getRowErrors(index);
      
      if (showOnlyErrors && rowErrors.length === 0) return false;
      
      if (filterType === 'error') {
        return rowErrors.some(error => error.type === 'error');
      }
      if (filterType === 'warning') {
        return rowErrors.some(error => error.type === 'warning');
      }
      
      return true;
    });
  }, [data, filterType, showOnlyErrors, entityErrors]);

  const handleCellEdit = (rowIndex: number, field: string, value: string) => {
    setEditingCell({ row: rowIndex, field });
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const updatedData = [...data];
    updatedData[editingCell.row] = setFieldValue(
      updatedData[editingCell.row],
      editingCell.field,
      editValue
    );

    switch (entityType) {
      case 'clients':
        setClients(updatedData as Client[]);
        break;
      case 'workers':
        setWorkers(updatedData as Worker[]);
        break;
      case 'tasks':
        setTasks(updatedData as Task[]);
        break;
    }

    setEditingCell(null);
    setEditValue('');
    
    // Re-run validation after edit
    setTimeout(() => runValidation(), 100);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const getCellStyle = (rowIndex: number, field: string) => {
    const errors = getFieldErrors(rowIndex, field);
    if (errors.length === 0) return 'bg-white border-gray-200';
    
    const hasError = errors.some(error => error.type === 'error');
    const hasWarning = errors.some(error => error.type === 'warning');
    
    if (hasError) return 'bg-red-50 border-red-300';
    if (hasWarning) return 'bg-yellow-50 border-yellow-300';
    
    return 'bg-white border-gray-200';
  };

  const getRowStyle = (rowIndex: number) => {
    const errors = getRowErrors(rowIndex);
    if (errors.length === 0) return '';
    
    const hasError = errors.some(error => error.type === 'error');
    return hasError ? 'bg-red-25' : 'bg-yellow-25';
  };

  const exportData = () => {
    const csvContent = [
      columns.join(','),
      ...filteredData.map(row => 
        columns.map(col => {
          const value = getFieldValue(row, col);
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entityType}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            Upload {entityType} data to view and validate it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {entityType} Data Grid
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredData.length} of {data.length} rows
              </span>
              {entityErrors.length > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">
                    {entityErrors.filter(e => e.type === 'error').length} errors,
                    {entityErrors.filter(e => e.type === 'warning').length} warnings
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Filter Controls */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Rows</option>
              <option value="error">Errors Only</option>
              <option value="warning">Warnings Only</option>
            </select>
            
            <button
              onClick={() => setShowOnlyErrors(!showOnlyErrors)}
              className={`p-2 rounded-lg transition-colors ${
                showOnlyErrors 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={showOnlyErrors ? 'Show all rows' : 'Show only rows with issues'}
            >
              {showOnlyErrors ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            
            <button
              onClick={runValidation}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="Re-run validation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={exportData}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
              title="Export filtered data"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredData.map((row) => {
                  const actualRowIndex = data.findIndex(item => item === row);
                  const rowErrors = getRowErrors(actualRowIndex);
                  
                  return (
                    <motion.tr
                      key={`${entityType}-${actualRowIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`hover:bg-gray-50 transition-colors ${getRowStyle(actualRowIndex)}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {actualRowIndex + 1}
                      </td>
                      {columns.map((column) => {
                        const isEditing = editingCell?.row === actualRowIndex && editingCell?.field === column;
                        const errors = getFieldErrors(actualRowIndex, column);
                        
                        return (
                          <td
                            key={column}
                            className={`px-4 py-3 text-sm border-l ${getCellStyle(actualRowIndex, column)}`}
                          >
                            {isEditing ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit();
                                    if (e.key === 'Escape') handleCancelEdit();
                                  }}
                                />
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="group flex items-center justify-between">
                                <span className="text-gray-900">
                                  {typeof getFieldValue(row, column) === 'object' 
                                    ? JSON.stringify(getFieldValue(row, column)) 
                                    : String(getFieldValue(row, column))
                                  }
                                </span>
                                <button
                                  onClick={() => handleCellEdit(actualRowIndex, column, String(getFieldValue(row, column)))}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-all"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                {errors.length > 0 && (
                                  <div className="flex items-center space-x-1 ml-2">
                                    {errors.some(e => e.type === 'error') && (
                                      <AlertTriangle className="w-4 h-4 text-red-500" />
                                    )}
                                    {errors.some(e => e.type === 'warning') && (
                                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {/* Error tooltip */}
                            {errors.length > 0 && !isEditing && (
                              <div className="mt-1">
                                {errors.map((error, errorIndex) => (
                                  <div
                                    key={errorIndex}
                                    className={`text-xs p-2 rounded ${
                                      error.type === 'error' 
                                        ? 'bg-red-100 text-red-700 border border-red-200' 
                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                    }`}
                                  >
                                    <div className="font-medium">{error.message}</div>
                                    {error.suggestion && (
                                      <div className="mt-1 flex items-center space-x-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span className="italic">{error.suggestion}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      
                      {/* Status Column */}
                      <td className="px-4 py-3 text-sm">
                        {rowErrors.length === 0 ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Valid</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {rowErrors.some(e => e.type === 'error') && (
                              <div className="flex items-center space-x-1 text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{rowErrors.filter(e => e.type === 'error').length} error(s)</span>
                              </div>
                            )}
                            {rowErrors.some(e => e.type === 'warning') && (
                              <div className="flex items-center space-x-1 text-yellow-600">
                                <AlertCircle className="w-4 h-4" />
                                <span>{rowErrors.filter(e => e.type === 'warning').length} warning(s)</span>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Summary */}
      {entityErrors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Validation Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-red-700">Errors ({entityErrors.filter(e => e.type === 'error').length})</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {entityErrors
                  .filter(error => error.type === 'error')
                  .slice(0, 5)
                  .map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      <strong>{error.entityId}</strong>: {error.message}
                    </div>
                  ))}
                {entityErrors.filter(e => e.type === 'error').length > 5 && (
                  <div className="text-sm text-gray-500 italic">
                    +{entityErrors.filter(e => e.type === 'error').length - 5} more errors...
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-yellow-700">Warnings ({entityErrors.filter(e => e.type === 'warning').length})</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {entityErrors
                  .filter(error => error.type === 'warning')
                  .slice(0, 5)
                  .map((error, index) => (
                    <div key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                      <strong>{error.entityId}</strong>: {error.message}
                    </div>
                  ))}
                {entityErrors.filter(e => e.type === 'warning').length > 5 && (
                  <div className="text-sm text-gray-500 italic">
                    +{entityErrors.filter(e => e.type === 'warning').length - 5} more warnings...
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataValidationGrid;
