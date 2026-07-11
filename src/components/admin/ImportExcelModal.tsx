import { useState, useRef } from 'react';
import { getStore, setStore } from '../../store';
import { X, UploadCloud } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportExcelModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportExcelModal({ onClose, onSuccess }: ImportExcelModalProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (!data || data.length === 0) {
          setError('No data found in excel file.');
          setLoading(false);
          return;
        }

        const store = getStore();
        let importedCount = 0;

        data.forEach((row: any) => {
          // Look for variations of studentid and name keys
          const idKey = Object.keys(row).find(k => k.toLowerCase().replace(/\s/g, '') === 'studentid');
          const nameKey = Object.keys(row).find(k => k.toLowerCase().trim() === 'name');

          if (idKey && nameKey) {
            const studentId = String(row[idKey]).trim();
            const name = String(row[nameKey]).trim();
            
            if (studentId && name) {
              // check if exists
              if (!store.users.some(u => u.id === studentId)) {
                store.users.push({
                  id: studentId,
                  name,
                  role: 'student',
                  passwordHash: studentId,
                  passwordChanged: false
                });
                importedCount++;
              }
            }
          }
        });

        if (importedCount > 0) {
          setStore(store);
          onSuccess();
        } else {
          setError('No valid new students found to import. Check column names (studentid, name).');
          setLoading(false);
        }

      } catch (err) {
        console.error(err);
        setError('Error parsing Excel file. Ensure it is a valid .xlsx file.');
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2">Import from Excel</h3>
          <p className="text-sm text-slate-500 mb-6">
            Upload an <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">.xlsx</code> file. Ensure the first worksheet has column headers named <strong className="text-slate-700">studentid</strong> and <strong className="text-slate-700">name</strong>.
          </p>

          {error && <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm font-medium rounded border border-red-100 text-left">{error}</div>}

          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
              loading ? 'border-slate-300 bg-slate-50' : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50/50'
            }`}
          >
            {loading ? (
              <div className="text-slate-500 font-medium text-sm animate-pulse">Processing...</div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-blue-700 font-bold mb-1 text-lg">Click to browse files</span>
                <span className="text-slate-400 text-sm">or drag and drop</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept=".xlsx, .xls"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}