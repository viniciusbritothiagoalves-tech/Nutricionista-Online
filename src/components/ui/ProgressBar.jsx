import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ currentStep, totalSteps, stepName }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-5 sm:mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
          {stepName}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
