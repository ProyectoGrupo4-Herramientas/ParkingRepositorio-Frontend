import React, { useState } from 'react';

const VolumeChart = ({ activeBar, onBarSelect, data }) => {


  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 h-[320px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-semibold text-slate-900">Volumen de Entrada</h3>
        <span className="text-xs font-medium text-slate-500">Today</span>
      </div>

      <div className="flex-1 flex items-end justify-between px-2 gap-2 relative">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="w-full h-full flex flex-col justify-end items-center group cursor-pointer"
            onClick={() => onBarSelect(index)}
          >
            {/* Value Label above active bar (like the "8" in image) */}
            <div className={`text-xs font-semibold mb-1 transition-opacity ${activeBar === index ? 'opacity-100 text-slate-900' : 'opacity-0'}`}>
              {item.label || Math.floor(item.height / 10)}
            </div>
            
            {/* The Bar */}
            <div 
              style={{ height: `${item.height}%` }}
              className={`w-full rounded-t-sm transition-all duration-300 ${
                activeBar === index ? 'bg-slate-900' : 'bg-blue-100 group-hover:bg-blue-200'
              }`}
            ></div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 px-2 text-xs font-medium text-slate-400">
        <span>6 AM</span>
        <span>Mediodía</span>
        <span>6 PM</span>
      </div>
    </div>
  );
};

export default VolumeChart;
