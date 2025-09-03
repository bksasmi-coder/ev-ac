
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 ${className}`}>
      {title && <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
