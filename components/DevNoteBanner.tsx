import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';

const DevNoteBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    
    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4" role="alert">
            <div className="flex">
                <div className="py-1">
                    <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/>
                    </svg>
                </div>
                <div>
                    <p className="font-bold">Note on Data Storage</p>
                    <p className="text-sm">This application currently saves your data locally on this device. Your account information will not be available on other devices or browsers.</p>
                </div>
                <div className="ml-auto pl-3">
                    <button onClick={handleDismiss} className="p-1.5 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800/60 focus:outline-none focus:ring-2 focus:ring-yellow-600" aria-label="Dismiss">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DevNoteBanner;
