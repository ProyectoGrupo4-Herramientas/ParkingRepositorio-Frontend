import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
        <div className="flex items-center space-x-2">
          {trend && (
            <span className={`text-[11px] font-bold ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
          )}
          <p className="text-[13px] text-slate-500 font-medium">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
