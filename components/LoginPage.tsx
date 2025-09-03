import React, { useState } from 'react';
import Card from './Card';

interface LoginPageProps {
  onLogin: (user: string, pass: string) => boolean;
  onRegister: (user: string, pass: string) => boolean;
  authError: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onRegister, authError }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError('Please fill out all fields.');
      return;
    }
    
    if (isRegistering) {
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        onRegister(username, password);
    } else {
        onLogin(username, password);
    }
  };
  
  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };


  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          EV Account Manager
        </h1>
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">{isRegistering ? 'Create Account' : 'Sign In'}</h2>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {isRegistering && (
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm Password
                    </label>
                    <div className="mt-1">
                        <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            )}
            
            {(error || authError) && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {error || authError}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isRegistering ? 'Sign up' : 'Sign in'}
              </button>
            </div>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                    {isRegistering ? 'Sign in' : 'Sign up'}
                </button>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;