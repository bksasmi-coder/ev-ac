import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, id }) => {
  return (
    <label htmlFor={id} className="flex items-center cursor-pointer select-none">
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:bg-indigo-600 transition-colors"></div>
        <div
          className="absolute left-0.5 top-0.5 bg-white border-gray-300 border rounded-full h-5 w-5 transition-transform peer-checked:transform peer-checked:translate-x-full"
        ></div>
      </div>
      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {label}
      </span>
    </label>
  );
};

export default ToggleSwitch;
