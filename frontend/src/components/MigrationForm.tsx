import React, { useState } from 'react';
import api from '../api';
import { EnvelopeIcon, KeyIcon, ServerIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
      setFormData(prev => ({ ...prev, source_password: '', dest_password: '' }));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to start migration');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon }: any) => (
      <div className="col-span-6 sm:col-span-4">
        <label htmlFor={name} className="block text-sm font-medium text-slate-300">{label}</label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
            </div>
            <input
                type={type}
                name={name}
                id={name}
                required
                value={(formData as any)[name]}
                onChange={handleChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-slate-600 rounded-md bg-slate-700 text-white placeholder-slate-400 py-2.5"
                placeholder={placeholder}
            />
        </div>
      </div>
  );

  return (
    <div className="bg-slate-800 shadow-xl rounded-2xl border border-slate-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-lg leading-6 font-semibold text-white">Start New Migration</h3>
          <p className="mt-1 text-sm text-slate-400">
            Configure your source and destination IMAP accounts to begin the transfer.
          </p>
      </div>
      <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-8 gap-x-8 md:grid-cols-2">
              
              {/* Source Account */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-700">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">1</span>
                    <h4 className="text-md font-medium text-white">Source Account</h4>
                </div>
                <div className="space-y-4">
                    <InputField label="Email Address" name="source_email" type="email" placeholder="user@source.com" icon={EnvelopeIcon} />
                    <InputField label="Password" name="source_password" type="password" placeholder="••••••••" icon={KeyIcon} />
                    <InputField label="IMAP Host" name="source_host" placeholder="imap.gmail.com" icon={ServerIcon} />
                </div>
              </div>

              {/* Destination Account */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-700">
                    <span className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">2</span>
                    <h4 className="text-md font-medium text-white">Destination Account</h4>
                </div>
                <div className="space-y-4">
                    <InputField label="Email Address" name="dest_email" type="email" placeholder="user@dest.com" icon={EnvelopeIcon} />
                    <InputField label="Password" name="dest_password" type="password" placeholder="••••••••" icon={KeyIcon} />
                    <InputField label="IMAP Host" name="dest_host" placeholder="imap.mail.yahoo.com" icon={ServerIcon} />
                </div>
              </div>

            </div>
            
            {error && (
                <div className="mt-6 rounded-md bg-red-500/10 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-400">{error}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 pt-5 border-t border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                    <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Starting...
                    </>
                ) : 'Start Migration'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default MigrationForm;
