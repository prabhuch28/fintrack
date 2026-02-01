
import React from 'react';
import { CategoryState, CategoryType } from '../types';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  category: CategoryState;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ category, icon: Icon, color, onClick }) => {
  const progress = (category.spent / category.limit) * 100;
  const isWarning = progress >= 80 && progress < 100;
  const isCritical = progress >= 100;

  const getStatusColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isWarning) return 'bg-amber-500';
    return color;
  };

  const getTextColor = () => {
    if (isCritical) return 'text-red-600';
    if (isWarning) return 'text-amber-600';
    return 'text-slate-600';
  };

  return (
    <button
      onClick={onClick}
      className="text-left w-full glass-card p-6 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-white shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-indigo-600'}`} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCritical ? 'bg-red-100 text-red-600' : isWarning ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
          {isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'HEALTHY'}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{category.id}</h3>
      <p className="text-slate-500 text-sm mb-4">Spending Status</p>

      <div className="flex justify-between items-end mb-2">
        <span className="text-2xl font-bold text-slate-900">${category.spent.toFixed(0)}</span>
        <span className="text-sm text-slate-400 font-medium">Limit: ${category.limit}</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 rounded-full ${getStatusColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      
      <p className={`text-xs font-semibold ${getTextColor()}`}>
        {isCritical ? 'Over budget!' : isWarning ? 'Approaching limit!' : `${(category.limit - category.spent).toFixed(0)} remaining`}
      </p>
    </button>
  );
};

export default StatsCard;
