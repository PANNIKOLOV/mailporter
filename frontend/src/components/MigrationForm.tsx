import React, { useState } from 'react';
import api from '../api';

interface MigrationFormProps {
  onMigrationStarted: (migration: any) => void;
}

const MigrationForm: React.FC<MigrationFormProps> = ({ onMigrationStarted }) => {
  const [formData, setFormData] = useState({
    source_email: '',
    source_password: '',
    source_host: '',
    dest_email: '',
    dest_password: '',
    dest_host: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      const response = await api.post(`/migrations/?user_id=${userId}`, formData);
      onMigrationStarted(response.data);
      // Reset form or keep it? Let's keep it for now but clear passwords maybe
      setFormData(prev => ({ ...prev, source_password: '', dest_password: '' }));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to start migration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">New Migration</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter the details for the source and destination email accounts.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              
              {/* Source Account */}
              <div className="col-span-6">
                <span className="text-md font-medium text-gray-700">Source Account</span>
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="source_email" required value={formData.source_email} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="source_password" required value={formData.source_password} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">IMAP Host</label>
                <input type="text" name="source_host" required value={formData.source_host} onChange={handleChange} placeholder="imap.gmail.com" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

              {/* Destination Account */}
              <div className="col-span-6 mt-4">
                <span className="text-md font-medium text-gray-700">Destination Account</span>
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="dest_email" required value={formData.dest_email} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="dest_password" required value={formData.dest_password} onChange={handleChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">IMAP Host</label>
                <input type="text" name="dest_host" required value={formData.dest_host} onChange={handleChange} placeholder="imap.mail.yahoo.com" className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>

            </div>
            
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
              >
                {loading ? 'Starting...' : 'Start Migration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MigrationForm;
