
import React, { useState } from 'react';
import { CategoryType } from '../types';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

interface UpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (amount: number, category: CategoryType, description: string, upiId: string) => void;
}

const UpiModal: React.FC<UpiModalProps> = ({ isOpen, onClose, onPayment }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [category, setCategory] = useState<CategoryType>(CategoryType.LIVING);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    
    // Simulate payment delay
    setTimeout(() => {
      onPayment(Number(amount), category, description, upiId);
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        setAmount('');
        setDescription('');
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Mock UPI Pay</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>

        <div className="p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Payment Successful</h3>
              <p className="text-slate-500 mt-2">Deducted ${amount} from {category}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipient UPI ID</label>
                <input 
                  required
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. coffee@upi"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      required
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-lg font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none"
                  >
                    {Object.values(CategoryType).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <input 
                  required
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="What is this for?"
                />
              </div>

              <button 
                disabled={status === 'processing'}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Securely...
                  </>
                ) : (
                  'Confirm & Pay'
                )}
              </button>
            </form>
          )}
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by MockUPI™ Secure Simulation</p>
        </div>
      </div>
    </div>
  );
};

export default UpiModal;
