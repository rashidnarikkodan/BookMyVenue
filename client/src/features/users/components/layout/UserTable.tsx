import React from 'react';
import type { User } from '../../types';
import { Users } from 'lucide-react';
import UserRow from './UserRow';
import { Pagination } from '@/shared/components/ui';

type Props = {
  users: User[];
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isActionLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const UserTable: React.FC<Props> = ({
  users,
  onDelete,
  onRestore,
  isActionLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="overflow-hidden bg-card shadow-sm rounded-2xl border border-border transition-colors duration-250">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Header */}
          <thead className="bg-background text-xs font-bold text-muted uppercase tracking-wider border-b border-border">
            <tr>
              <th className="p-4 w-20">Avatar</th>
              <th className="p-4">User</th>
              <th className="p-4 hidden sm:table-cell">Role</th>
              <th className="p-4 hidden md:table-cell">Date Joined</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4 w-40 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="rounded-full bg-background border border-border p-4 text-muted">
                      <Users size={32} className="stroke-[1.2]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">No Users Found</p>
                      <p className="text-xs text-muted mt-1">
                        Try adjusting your search criteria or add a new user.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id || user._id}
                  user={user}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  isActionLoading={isActionLoading}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};

export default UserTable;
