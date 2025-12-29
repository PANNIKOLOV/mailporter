import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import MigrationForm from '../components/MigrationForm';
import MigrationList from '../components/MigrationList';

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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">MailPorter Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
             <div className="grid grid-cols-1 gap-8">
                <section>
                    <MigrationForm onMigrationStarted={handleMigrationStarted} />
                </section>
                
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Migration History</h2>
                    <MigrationList migrations={migrations} />
                </section>
             </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
