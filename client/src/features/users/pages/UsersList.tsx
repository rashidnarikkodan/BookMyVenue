import { useEffect, useState, useMemo, useCallback } from 'react';
import UserHeader from '../components/layout/UserHeader';
import UserTable from '../components/layout/UserTable';
import UserToolbar from '../components/layout/UserToolbar';
import { usersApi } from '../services/users.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { User } from '../types';
import { Loading } from '@/shared/components/ui';
import { toast } from 'sonner';
import { Users, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';

const UsersList = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'owner' | 'user'>('all');

  // useAsyncFetch hooks
  const {
    data: listResponse,
    loading,
    execute: fetchUsers,
  } = useAsyncFetch<{ success: boolean; message: string; data: User[] }>();

  const { loading: actionLoading, execute: executeAction } = useAsyncFetch<{
    success: boolean;
    message: string;
    data: User;
  }>();

  // Extract users list safely
  const users = useMemo(() => listResponse?.data || [], [listResponse]);

  // Debounce Search Input
  const debouncedSearch = useDebounce(search, 400);

  // Fetch Users function using useCallback to avoid missing dependency lint errors
  const loadUsers = useCallback(() => {
    fetchUsers(() =>
      usersApi.getAll({
        search: debouncedSearch,
        sort: sortBy,
        status: filter,
        role: roleFilter,
      })
    );
  }, [fetchUsers, debouncedSearch, sortBy, filter, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Delete User (Soft Delete)
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to disable this user account?')) return;

    try {
      await executeAction(() => usersApi.remove(id));
      toast.success('User disabled successfully');
      loadUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to disable user';
      toast.error(msg);
    }
  };

  // Restore User
  const handleRestore = async (id: string) => {
    try {
      await executeAction(() => usersApi.restore(id));
      toast.success('User restored successfully');
      loadUsers();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to restore user';
      toast.error(msg);
    }
  };

  // Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserHeader />

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Total Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Users size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Users</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.total}
            </p>
          </div>
        </div>

        {/* Active Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Active Accounts
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.active}
            </p>
          </div>
        </div>

        {/* Inactive Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-error/10 p-3 text-error">
            <AlertTriangle size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Disabled Accounts
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.inactive}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <UserToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filter={filter}
        onFilterChange={setFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Content Area */}
      {loading ? (
        <Loading />
      ) : (
        <UserTable
          users={users}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isActionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default UsersList;
