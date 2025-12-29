import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import MigrationForm from '../components/MigrationForm';
import MigrationList from '../components/MigrationList';
import { ArrowRightOnRectangleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [migrations, setMigrations] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchMigrations(userId);
    
    // Simple polling for status updates
    const interval = setInterval(() => {
        fetchMigrations(userId);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchMigrations = async (userId: string) => {
    try {
      const response = await api.get(`/migrations/?user_id=${userId}`);
      setMigrations(response.data);
    } catch (error) {
      console.error('Failed to fetch migrations', error);
    }
  };

  const handleMigrationStarted = (newMigration: any) => {
    setMigrations([newMigration, ...migrations]);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10 backdrop-blur-md bg-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-600 rounded-lg p-1.5">
                        <EnvelopeIcon className="h-6 w-6 text-white" />
                    </div>
                    <span className="ml-3 text-xl font-bold text-white tracking-tight">MailPorter</span>
                </div>
                <div>
                    <button 
                        onClick={handleLogout}
                        className="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="-ml-1 mr-2 h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                        Manage your email migrations and track their progress in real-time.
                    </p>
                </div>
            </div>

             <div className="space-y-8">
                <section>
                    <MigrationForm onMigrationStarted={handleMigrationStarted} />
                </section>
                
                <section>
                    <MigrationList migrations={migrations} />
                </section>
             </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
