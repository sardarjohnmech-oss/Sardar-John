
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Download, 
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
  Settings2,
  FileText
} from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | string | ((item: T) => React.ReactNode);
  align?: 'left' | 'center' | 'right';
  id?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  onEdit?: (item: T, currentColumns: Column<T>[]) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  searchPlaceholder?: string;
  key?: string | number;
}

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
  
  const [columns, setColumns] = useState<Column<T>[]>(() => 
    initialColumns.map(c => ({ ...c, id: c.id || `col-${c.header}-${Math.random()}` }))
  );
  
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [openSettingsIndex, setOpenSettingsIndex] = useState<number | null>(null);
  const [tempHeaderName, setTempHeaderName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
    const timestamp = Date.now();
    const fieldKey = `custom_field_${timestamp}`;
    const newColumn: Column<T> = {
      header: `New Field ${columns.length + 1}`,
      accessor: fieldKey,
      align: 'left',
      id: `col_${timestamp}`
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

  const saveHeader = (index: number) => {
    const newCols = [...columns];
    newCols[index].header = tempHeaderName;
    setColumns(newCols);
    setEditingHeaderIndex(null);
  };

  const openPdf = (base64: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${base64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  const renderCellContent = (item: T, col: Column<T>) => {
    const value = typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor as keyof T] as any);
    
    if (typeof value === 'string' && value.startsWith('data:application/pdf')) {
      return (
        <button 
          onClick={() => openPdf(value)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors group"
        >
          <FileText className="w-4 h-4" />
          <span className="text-xs font-bold underline decoration-blue-200 group-hover:decoration-blue-800">View PDF</span>
        </button>
      );
    }

    return value || '-';
  };

  return (
    <div className="bg-white rounded-[2rem] border shadow-sm flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
      <div className="p-8 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
          <p className="text-[10px] text-orange-600 font-black tracking-[0.2em] uppercase mt-2">{filteredData.length} records verified</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-orange-500/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleAddColumn} className="flex items-center px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
            <Columns className="w-4 h-4 mr-3 text-orange-600" /> Col
          </button>
          <button onClick={handleExport} className="flex items-center px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-black text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest shadow-sm">
            <Download className="w-4 h-4 mr-3 text-orange-600" /> Export
          </button>
          {onAdd && (
            <button onClick={onAdd} className="px-7 py-3.5 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-700 shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
              New Record
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar relative">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b">
              {columns.map((col, i) => (
                <th 
                  key={col.id} 
                  draggable={!editingHeaderIndex}
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(i)}
                  className={`px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] relative group/th transition-colors cursor-move ${draggedIndex === i ? 'opacity-30 bg-orange-50' : ''}`}
                  style={{ textAlign: col.align || 'left', minWidth: '120px' }}
                >
                  <div className={`flex items-center gap-3 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    
                    {editingHeaderIndex === i ? (
                      <div className="flex items-center bg-white border-2 border-orange-500 rounded-xl shadow-lg z-20" onClick={e => e.stopPropagation()}>
                        <input 
                          autoFocus
                          value={tempHeaderName}
                          onChange={(e) => setTempHeaderName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveHeader(i)}
                          className="px-4 py-2 outline-none w-32 text-[12px] font-black text-gray-900"
                        />
                        <button onClick={() => saveHeader(i)} className="p-2 hover:bg-green-50 text-green-600 border-l"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingHeaderIndex(null)} className="p-2 hover:bg-red-50 text-red-600 border-l"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <span className="leading-tight break-words">{col.header}</span>
                    )}

                    {!editingHeaderIndex && (
                      <div className="relative flex-shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenSettingsIndex(openSettingsIndex === i ? null : i); }}
                          className={`p-2 rounded-xl transition-all ${openSettingsIndex === i ? 'text-orange-600 bg-orange-100 ring-2 ring-orange-200' : 'text-gray-300 opacity-0 group-hover/th:opacity-100 hover:bg-gray-100'}`}
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>

                        {openSettingsIndex === i && (
                          <>
                            <div className="fixed inset-0 z-20" onClick={() => setOpenSettingsIndex(null)}></div>
                            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white border border-gray-100 rounded-[2rem] shadow-2xl z-40 min-w-[220px] p-3 animate-in slide-in-from-top-3 duration-200 cursor-default">
                              <div className="px-4 py-3 border-b border-gray-50 mb-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Configuration</p>
                              </div>
                              
                              <button onClick={() => { setEditingHeaderIndex(i); setTempHeaderName(columns[i].header); setOpenSettingsIndex(null); }} className="w-full flex items-center px-4 py-3 text-[12px] font-black text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all mb-1">
                                <Edit2 className="w-4 h-4 mr-4" /> Rename Field
                              </button>
                              
                              <button onClick={() => cycleAlignment(i)} className="w-full flex items-center px-4 py-3 text-[12px] font-black text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all mb-1">
                                {col.align === 'center' ? <AlignCenter className="w-4 h-4 mr-4" /> : 
                                 col.align === 'right' ? <AlignRight className="w-4 h-4 mr-4" /> : 
                                 <AlignLeft className="w-4 h-4 mr-4" />}
                                Align: {col.align || 'left'}
                              </button>
                              
                              <div className="h-px bg-gray-50 my-2 mx-2"></div>
                              
                              <button onClick={() => handleDeleteColumn(i)} className="w-full flex items-center px-4 py-3 text-[12px] font-black text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                <Trash2 className="w-4 h-4 mr-4" /> Drop Column
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
                <th className="px-6 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-orange-50/10 transition-colors group/row">
                {columns.map((col, i) => (
                  <td key={`${item.id}-${col.id}`} className="px-6 py-6 text-sm font-bold text-gray-700" style={{ textAlign: col.align || 'left' }}>
                    {renderCellContent(item, col)}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      {onView && <button onClick={() => onView(item)} className="p-3 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Eye className="w-5 h-5" /></button>}
                      {onEdit && <button onClick={() => onEdit(item, columns)} className="p-3 text-gray-300 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all"><Edit2 className="w-5 h-5" /></button>}
                      {onDelete && <button onClick={() => onDelete(item)} className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-5 h-5" /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-gray-300">
             <Search className="w-16 h-16 mb-6 opacity-20" />
             <p className="text-sm font-black uppercase tracking-[0.3em]">No matching records</p>
          </div>
        )}
      </div>

      <div className="p-8 border-t bg-gray-50/50 flex items-center justify-between">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Registry v5.5</p>
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
          <button className="w-11 h-11 rounded-2xl bg-orange-600 text-white text-[12px] font-black shadow-lg shadow-orange-600/20">1</button>
          <button className="p-3 rounded-2xl border border-gray-100 bg-white text-gray-400 disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
