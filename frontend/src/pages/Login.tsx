import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isRegistering) {
        const response = await api.post('/auth/users/', { email, password });
        localStorage.setItem('userId', response.data.id);
        navigate('/dashboard');
      } else {
        // Simulating login for this demo since we don't have a real JWT flow yet
        // In a real app, you'd POST to /auth/token
        // For now, we'll just try to find the user by registering or assume success if we were implementing real auth
        // To keep it simple for the user:
        if (email && password) {
             // Mock login success for demo purposes if not registering
             // Ideally we should check against DB, but let's guide user to Register for now if Login fails
             setError("Please use Register to create a new account for this demo.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full space-y-8 relative z-10 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
        <div>
            <div className="mx-auto h-12 w-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            {isRegistering ? 'Start moving your emails safely today.' : 'Sign in to manage your migrations.'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-slate-600 placeholder-slate-500 text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-slate-600 placeholder-slate-500 text-white bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-400">{error}</h3>
                    </div>
                </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : null}
              {isRegistering ? 'Register' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <button 
                type="button" 
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                }}
            >
                {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
