
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface User {
    username: string;
    password: string;
}

export function useAuth(): {
    isAuthenticated: boolean;
    currentUser: string | null;
    login: (user: string, pass: string) => boolean;
    logout: () => void;
    register: (user: string, pass: string) => boolean;
    error: string | null;
} {
    const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);
    const isAuthenticated = !!currentUser;
    const [users, setUsers] = useLocalStorage<User[]>('users', [{ username: 'admin', password: 'password' }]);
    const [error, setError] = useState<string | null>(null);

    const login = (user: string, pass: string): boolean => {
        const foundUser = users.find(u => u.username === user && u.password === pass);
        if (foundUser) {
            setCurrentUser(user);
            setError(null);
            return true;
        }
        setError('Invalid username or password.');
        setCurrentUser(null);
        return false;
    };
    
    const register = (user: string, pass: string): boolean => {
        const userExists = users.some(u => u.username.toLowerCase() === user.toLowerCase());
        if (userExists) {
            setError('Username already exists.');
            return false;
        }
        setUsers(prevUsers => [...prevUsers, { username: user, password: pass }]);
        setCurrentUser(user); // Automatically log in after registration
        setError(null);
        return true;
    };


    const logout = () => {
        setCurrentUser(null);
    };

    return { isAuthenticated, currentUser, login, logout, register, error };
}
