import React from 'react';
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon, 
    ArrowPathIcon,
    InboxArrowDownIcon
} from '@heroicons/react/24/solid';

interface Migration {
  id: number;
  source_email: string;
  dest_email: string;
  status: string;
  created_at: string;
  logs?: string;
}

interface MigrationListProps {
  migrations: Migration[];
}

const MigrationList: React.FC<MigrationListProps> = ({ migrations }) => {
  
  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'completed':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-green-600" />
                    Completed
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-red-600" />
                    Failed
                </span>
            );
        case 'in_progress':
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <ArrowPathIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-yellow-600 animate-spin" />
                    In Progress
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    <ClockIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-slate-600" />
                    Pending
                </span>
            );
    }
  };

  return (
    <div className="bg-slate-800 shadow-xl rounded-2xl border border-slate-700 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
            <div>
                <h3 className="text-lg leading-6 font-semibold text-white">Migration History</h3>
                <p className="mt-1 text-sm text-slate-400">
                    View the status of your past and current email transfers.
                </p>
            </div>
            <div className="bg-slate-700 p-2 rounded-lg">
                <InboxArrowDownIcon className="h-6 w-6 text-indigo-400" />
            </div>
        </div>
      <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Destination
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {migrations.map((migration) => (
                  <tr key={migration.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">
                      #{migration.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {migration.source_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {migration.dest_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(migration.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {new Date(migration.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {migrations.length === 0 && (
                <div className="text-center py-12">
                    <InboxArrowDownIcon className="mx-auto h-12 w-12 text-slate-600" />
                    <h3 className="mt-2 text-sm font-medium text-slate-300">No migrations yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating a new migration above.</p>
                </div>
            )}
      </div>
    </div>
  );
};

export default MigrationList;
