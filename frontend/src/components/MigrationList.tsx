import React from 'react';

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
  return (
    <div className="flex flex-col mt-8">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {migrations.map((migration) => (
                  <tr key={migration.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{migration.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {migration.source_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {migration.dest_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${migration.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          migration.status === 'failed' ? 'bg-red-100 text-red-800' : 
                          migration.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {migration.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(migration.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {migrations.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No migrations found.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationList;
