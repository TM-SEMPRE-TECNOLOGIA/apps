import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';
import { FileData } from '../types';

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFilesSelected: (files: FileData[]) => void;
  helperText?: string;
  icon?: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  accept = ".docx", 
  multiple = false,
  onFilesSelected,
  helperText = "Suporta apenas arquivos .docx",
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const validFiles = files; // In a real app, filter by type here
    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    
    // Convert to FileData for parent
    const fileDataList: FileData[] = validFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified
    }));
    onFilesSelected(fileDataList);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    // Notify parent of removal if needed, or just keep local state sync
    const fileDataList: FileData[] = newFiles.map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified
    }));
    onFilesSelected(fileDataList);
  };

  return (
    <div className="w-full">
      <div 
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          border-[1.5px] border-dashed rounded-tm p-8
          transition-all duration-300 ease-out
          flex items-center justify-between gap-6
          ${isDragging 
            ? 'border-tm-primary bg-green-50/50 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]' 
            : 'border-tm-border bg-gradient-to-b from-sky-50/50 to-green-50/30 hover:border-tm-primary/50 hover:shadow-tm-sm'
          }
        `}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept={accept} 
          multiple={multiple} 
          onChange={handleChange}
        />
        
        <div className="flex items-center gap-4">
          <div className={`
            w-14 h-14 rounded-2xl border border-white/50 shadow-tm-sm flex items-center justify-center
            bg-white/60 backdrop-blur-sm transition-transform group-hover:scale-110
            text-tm-secondary
          `}>
            {icon || <UploadCloud size={24} strokeWidth={2.5} />}
          </div>
          
          <div className="text-left">
            <h3 className="font-extrabold text-sm md:text-base text-tm-dark">
              {label}
            </h3>
            <p className="text-xs font-medium text-gray-500 mt-1">
              {helperText}
            </p>
          </div>
        </div>

        <div className="hidden md:block">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-tm-border text-xs font-bold text-gray-600 shadow-sm">
                Selecionar
            </span>
        </div>
      </div>

      {/* File List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-tm-border rounded-xl shadow-tm-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <FileText size={16} />
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-800 font-mono">{file.name}</p>
                    <p className="text-[10px] font-medium text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={16} className="text-green-500" />
                 <button 
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors"
                 >
                    <X size={16} />
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};