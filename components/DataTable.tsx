
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Edit2, 
  Trash2, 
  Eye, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Check, 
  X,
  Columns,
  Settings2
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  id?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  searchPlaceholder?: string;
  /** Explicitly include key to support instance identification in generic component JSX */
  key?: string | number;
}

// Generic DataTable component with strict identification requirements for T
function DataTable<T extends { id: string }>({ 
  title, 
  data, 
  columns: initialColumns, 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  searchPlaceholder = "Search records..." 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize state from props
  const [columns, setColumns] = useState<Column<T>[]>(() => 
    initialColumns.map(c => ({ ...c, id: c.id || `col-${c.header}-${Math.random()}` }))
  );
  
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [openSettingsIndex, setOpenSettingsIndex] = useState<number | null>(null);
  const [tempHeaderName, setTempHeaderName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Re-sync only if the initialColumns array itself changes (e.g. page navigation)
  useEffect(() => {
    setColumns(initialColumns.map(c => ({ ...c, id: c.id || `col-${c.header}-${Math.random()}` })));
  }, [initialColumns]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm]);

  const handleExport = () => {
    alert(`Exporting ${filteredData.length} records...`);
  };

  const handleAddColumn = () => {
    const newColumn: Column<T> = {
      header: `New Field ${columns.length + 1}`,
      accessor: () => '-',
      align: 'left',
      id: `custom_${Date.now()}`
    };
    setColumns([...columns, newColumn]);
  };

  const handleDeleteColumn = (index: number) => {
    if (columns.length <= 1) {
      alert("At least one column must remain.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete the column "${columns[index].header}"?`)) {
      const updated = [...columns];
      updated.splice(index, 1);
      setColumns(updated);
      setOpenSettingsIndex(null);
    }
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= columns.length) return;
    const updated = [...columns];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setColumns(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      moveColumn(draggedIndex, index);
    }
    setDraggedIndex(null);
  };

  const cycleAlignment = (index: number) => {
    const newColumns = [...columns];
    const current = newColumns[index].align || 'left';
    const mapping: Record<string, 'left' | 'center' | 'right'> = {
      'left': 'center',
      'center': 'right',
      'right': 'left'
    };
    newColumns[index].align = mapping[current];
    setColumns(newColumns);
  };

  const startEditing = (index: number) => {
    setEditingHeaderIndex(index);
    setTempHeaderName(columns[index].header);
    setOpenSettingsIndex(null);
  };

  const saveHeader = (index: number) => {
    const newCols = [...columns];
    newCols[index].header = tempHeaderName;
    setColumns(newCols);
    setEditingHeaderIndex(null);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-5 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase tracking-[0.1em]">{filteredData.length} records</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleAddColumn} className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Columns className="w-4 h-4 mr-2 text-orange-500" /> Add Col
          </button>
          <button onClick={handleExport} className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Download className="w-4 h-4 mr-2 text-orange-500" /> Export
          </button>
          {onAdd && (
            <button onClick={onAdd} className="px-5 py-2 bg-orange-600 text-white rounded-xl text-sm font-black hover:bg-orange-700 shadow-lg shadow-orange-600/20 active:scale-95 transition-all">
              Add Record
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar relative">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b">
              {columns.map((col, i) => (
                <th 
                  key={col.id} 
                  draggable={!editingHeaderIndex}
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  className={`px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] relative group/th transition-colors cursor-move ${draggedIndex === i ? 'opacity-30 bg-orange-50' : ''}`}
                  style={{ textAlign: col.align || 'left' }}
                >
                  <div className={`flex items-center gap-3 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    
                    {editingHeaderIndex === i ? (
                      <div className="flex items-center bg-white border border-orange-500 rounded-lg shadow-sm z-20">
                        <input 
                          autoFocus
                          value={tempHeaderName}
                          onChange={(e) => setTempHeaderName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveHeader(i)}
                          className="px-2 py-1 outline-none w-28 text-[11px] font-bold text-gray-900"
                        />
                        <button onClick={() => saveHeader(i)} className="p-1.5 hover:bg-green-50 text-green-600 border-l"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setEditingHeaderIndex(null)} className="p-1.5 hover:bg-red-50 text-red-600 border-l"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <span className="truncate max-w-[120px]">{col.header}</span>
                    )}

                    {!editingHeaderIndex && (
                      <div className="relative flex-shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenSettingsIndex(openSettingsIndex === i ? null : i); }}
                          className={`p-1.5 rounded-lg transition-all ${openSettingsIndex === i ? 'text-orange-600 bg-orange-100 ring-2 ring-orange-200' : 'text-gray-400 opacity-0 group-hover/th:opacity-100 hover:bg-gray-200'}`}
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                        </button>

                        {openSettingsIndex === i && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setOpenSettingsIndex(null)}></div>
                            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 min-w-[190px] p-2 animate-in slide-in-from-top-2 duration-200 cursor-default">
                              <div className="px-3 py-2 border-b border-gray-50 mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Column Management</p>
                              </div>
                              
                              <button onClick={() => startEditing(i)} className="w-full flex items-center px-3 py-2 text-[11px] font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all mb-1">
                                <Edit2 className="w-4 h-4 mr-3" /> Rename
                              </button>
                              
                              <button onClick={() => cycleAlignment(i)} className="w-full flex items-center px-3 py-2 text-[11px] font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all mb-1">
                                {col.align === 'center' ? <AlignCenter className="w-4 h-4 mr-3" /> : 
                                 col.align === 'right' ? <AlignRight className="w-4 h-4 mr-3" /> : 
                                 <AlignLeft className="w-4 h-4 mr-3" />}
                                Align: {col.align || 'left'}
                              </button>
                              
                              <div className="h-px bg-gray-50 my-1 mx-2"></div>
                              
                              <button onClick={() => handleDeleteColumn(i)} className="w-full flex items-center px-3 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 className="w-4 h-4 mr-3" /> Remove Column
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.15em] text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-orange-50/10 transition-colors group">
                {columns.map((col, i) => (
                  <td key={`${item.id}-${col.id}`} className="px-6 py-4 text-sm font-medium text-gray-600" style={{ textAlign: col.align || 'left' }}>
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onView && <button onClick={() => onView(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>}
                      {onEdit && <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>}
                      {onDelete && <button onClick={() => onDelete(item)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 border-t bg-gray-50/40 flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Viewing {filteredData.length} records</p>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-9 h-9 rounded-xl bg-orange-600 text-white text-xs font-black">1</button>
          <button className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
