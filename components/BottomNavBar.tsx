import React from 'react';
import HomeIcon from './icons/HomeIcon';
import AddIcon from './icons/AddIcon';
import ReportIcon from './icons/ReportIcon';
import ServiceIcon from './icons/ServiceIcon';

type View = 'dashboard' | 'report' | 'service';

interface BottomNavBarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onAdd: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  const activeClasses = 'text-indigo-600 dark:text-indigo-400';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200';
  
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-150 focus:outline-none ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onViewChange, onAdd }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg flex justify-around z-40">
      <NavItem
        icon={<HomeIcon className="w-6 h-6" />}
        label="Dashboard"
        isActive={activeView === 'dashboard'}
        onClick={() => onViewChange('dashboard')}
      />
      <NavItem
        icon={<ReportIcon className="w-6 h-6" />}
        label="Reports"
        isActive={activeView === 'report'}
        onClick={() => onViewChange('report')}
      />
       <button 
          onClick={onAdd}
          className="relative -top-6 flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
          aria-label="Add new transaction"
        >
          <AddIcon className="w-8 h-8" />
       </button>
      <NavItem
        icon={<ServiceIcon className="w-6 h-6" />}
        label="Service Log"
        isActive={activeView === 'service'}
        onClick={() => onViewChange('service')}
      />
    </nav>
  );
};

export default BottomNavBar;