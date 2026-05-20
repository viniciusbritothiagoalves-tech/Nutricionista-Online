import React from 'react';
import { motion } from 'framer-motion';

export const RadioCard = ({ id, label, icon: Icon, selected, onChange }) => {
  return (
    <label 
      className={`
        relative flex flex-row items-center justify-start py-2.5 px-3 sm:p-4 cursor-pointer rounded-[14px] border transition-all duration-300 gap-2 sm:gap-3
        ${selected 
          ? 'border-primary bg-primary/[0.03] text-primary shadow-[0_4px_20px_-4px_rgba(27,67,50,0.1)] ring-1 ring-primary/20 scale-[1.01]' 
          : 'border-border/60 bg-white text-slate-600 hover:border-gold/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-[1.5px]'
        }
      `}
    >
      <input
        type="radio"
        name="radio-group"
        value={id}
        checked={selected}
        onChange={() => onChange(id)}
        onClick={() => selected && onChange(id)}
        className="sr-only"
      />
      {selected && (
        <motion.div 
          layoutId="radio-indicator"
          className="absolute inset-0 border-[1.5px] border-primary rounded-[14px] pointer-events-none shadow-sm"
          initial={false}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
      )}
      <div className="flex-shrink-0">
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${selected ? 'text-primary' : 'text-slate-400'}`} strokeWidth={1.5} />
      </div>
      <span className="text-left font-medium text-[14px] sm:text-[15px] leading-tight sm:leading-snug">
        {label}
      </span>
    </label>
  );
};
