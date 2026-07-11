import { useState, useEffect } from 'react';
import { getStore, setStore } from '../../store';
import { Election } from '../../types';
import { X } from 'lucide-react';

interface ElectionModalProps {
  election: Election | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ElectionModal({ election, onClose, onSuccess }: ElectionModalProps) {
  const [title, setTitle] = useState(election?.title || '');
  
  // Format for datetime-local input: YYYY-MM-DDThh:mm
  const formatForInput = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    // adjust for local timezone offset for input display
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0,16);
  };

  const [startTime, setStartTime] = useState(election ? formatForInput(election.startTime) : '');
  const [endTime, setEndTime] = useState(election ? formatForInput(election.endTime) : '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !startTime || !endTime) {
      setError('Please fill in all fields.');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time must be after start time.');
      return;
    }

    const store = getStore();

    if (election) {
      const index = store.elections.findIndex(e => e.id === election.id);
      if (index !== -1) {
        store.elections[index] = {
          ...election,
          title,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };
      }
    } else {
      store.elections.push({
        id: `e_${Date.now()}`,
        title,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        candidates: []
      });
    }

    setStore(store);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{election ? 'Edit Election' : 'Create New Election'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Presidential Election"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm">
              {election ? 'Save Changes' : 'Create Election'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}