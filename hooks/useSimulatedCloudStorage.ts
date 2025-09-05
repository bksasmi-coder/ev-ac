import { useState, useEffect, useCallback } from 'react';

/**
 * ## Simulated Cloud Storage Hook
 * 
 * This hook simulates fetching and saving data to a cloud backend.
 * **Important:** In this implementation, it uses the browser's `localStorage` for 
 * demonstration purposes. This means all data is stored *only on the current device*
 * and will **not** be accessible from other devices or browsers.
 * 
 * To enable true cross-device synchronization, the logic inside `fetchData` and `saveData`
 * must be replaced with actual `fetch()` calls to a real backend API and database.
 * The current structure is designed to make this transition as smooth as possible.
 */
export function useSimulatedCloudStorage<T>(key: string, initialValue: T): {
    data: T;
    setData: (value: T | ((val: T) => T)) => void;
    isLoading: boolean;
    error: string | null;
} {
    const [data, setDataState] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        console.log(`Simulating fetch from local storage for key: ${key}`);
        try {
            // --- REAL BACKEND IMPLEMENTATION (EXAMPLE) ---
            // const response = await fetch(`/api/data/${key}`, {
            //   headers: { 'Authorization': `Bearer YOUR_AUTH_TOKEN` }
            // });
            // if (!response.ok) throw new Error('Failed to fetch data from the cloud.');
            // const cloudData = await response.json();
            // setDataState(cloudData);

            // --- DEMO IMPLEMENTATION (using localStorage) ---
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            const item = window.localStorage.getItem(key);
            setDataState(item ? JSON.parse(item) : initialValue);

        } catch (err) {
            console.error(err);
            setError('Could not load data. Please try again later.');
            const item = window.localStorage.getItem(key);
            setDataState(item ? JSON.parse(item) : initialValue);
        } finally {
            setIsLoading(false);
        }
    // initialValue is removed to prevent an infinite loop, as its reference changes on each render.
    // This is safe because initialValue is conceptually static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    useEffect(() => {
        // A key ending in '_null' indicates no user is logged in.
        if (key.endsWith('_null')) {
            setIsLoading(false);
            setDataState(initialValue);
            return;
        }
        fetchData();
    }, [fetchData, key]);
    
    const saveData = useCallback(async (valueToStore: T) => {
        console.log(`Simulating save to local storage for key: ${key}`);
        try {
            // --- REAL BACKEND IMPLEMENTATION (EXAMPLE) ---
            // const response = await fetch(`/api/data/${key}`, {
            //     method: 'POST',
            //     headers: { 
            //       'Content-Type': 'application/json',
            //       'Authorization': `Bearer YOUR_AUTH_TOKEN`
            //     },
            //     body: JSON.stringify(valueToStore),
            // });
            // if (!response.ok) throw new Error('Failed to save data to the cloud.');

             // --- DEMO IMPLEMENTATION (using localStorage) ---
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            setError(null);

        } catch (err) {
            console.error(err);
            setError('Could not save data. Changes might not be persisted.');
        }
    }, [key]);

    const setData = (value: T | ((val: T) => T)) => {
        const valueToStore = value instanceof Function ? value(data) : value;
        setDataState(valueToStore);
        if (!key.endsWith('_null')) {
            saveData(valueToStore);
        }
    };

    return { data, setData, isLoading, error };
}