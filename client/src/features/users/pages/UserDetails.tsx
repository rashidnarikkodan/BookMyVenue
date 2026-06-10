import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersApi } from '../services/users.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { User } from '../types';
import {
  ChevronLeft,
  Trash2,
  RotateCcw,
  Calendar,
  User as UserIcon,
  Shield,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // useAsyncFetch hooks
  const {
    data: fetchResponse,
    loading,
    execute: fetchUser,
  } = useAsyncFetch<{ success: boolean; message: string; data: User }>();

  const { loading: actionLoading, execute: executeAction } = useAsyncFetch<{
    success: boolean;
    message: string;
    data: User;
  }>();

  const user = fetchResponse?.data;

  const loadUser = useCallback(() => {
    if (id) {
      fetchUser(() => usersApi.getById(id));
    }
  }, [id, fetchUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Soft delete / disable user
  const handleDelete = async () => {
    if (!user) return;
    const userId = user.id || user._id || '';
    if (!window.confirm('Are you sure you want to disable this user account?')) return;

    try {
      await executeAction(() => usersApi.remove(userId));
      toast.success('User account disabled successfully');
      loadUser();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to disable user';
      toast.error(msg);
    }
  };

  // Restore user
  const handleRestore = async () => {
    if (!user) return;
    const userId = user.id || user._id || '';
    try {
      await executeAction(() => usersApi.restore(userId));
      toast.success('User account restored successfully');
      loadUser();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to restore user';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted">Loading user profile details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-error/10 border border-error/20 p-4 text-error mb-4">
          <UserIcon size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground">User Not Found</h2>
        <p className="text-sm text-muted mt-2">
          The user profile you are trying to view does not exist or may have been deleted.
        </p>
        <Link
          to="/admin/users"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-all"
        >
          <ChevronLeft size={16} /> Back to Users List
        </Link>
      </div>
    );
  }

  const formattedCreated = user.createdAt
    ? new Date(user.createdAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const formattedUpdated = user.updatedAt
    ? new Date(user.updatedAt).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const roleLabels = {
    admin: 'Administrator',
    owner: 'Venue Owner',
    user: 'Customer',
  };

  const roleStyles = {
    admin:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/10 dark:text-purple-400',
    owner:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/10 dark:text-blue-400',
    user: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:text-emerald-400',
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/users')}
            className="rounded-xl border border-border bg-background p-2.5 text-muted hover:text-foreground transition-all hover:bg-surface active:scale-95 cursor-pointer"
            title="Back to Users"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {user.name}
              </h1>
              {user.isActive ? (
                <span className="inline-flex items-center rounded-lg border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center rounded-lg border border-error/20 bg-error/10 px-2.5 py-0.5 text-xs font-semibold text-error">
                  Inactive
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">User ID: {user.id || user._id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {user.isActive ? (
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-error
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-error/20
                hover:bg-error/90
                transition-all
                disabled:opacity-50
                active:scale-95
                cursor-pointer
              "
            >
              <Trash2 size={16} />
              Disable Account
            </button>
          ) : (
            <button
              onClick={handleRestore}
              disabled={actionLoading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-success
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-success/20
                hover:bg-success/90
                transition-all
                disabled:opacity-50
                active:scale-95
                cursor-pointer
              "
            >
              <RotateCcw size={16} />
              Restore Account
            </button>
          )}
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Info blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Profile Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Email Address
                  </span>
                  <span className="text-xs font-semibold text-foreground">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Shield size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    User Role
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 mt-0.5 text-xs font-semibold ${roleStyles[user.role]}`}
                  >
                    {roleLabels[user.role]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Registration Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Joined Date
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formattedCreated}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-background border border-border p-2 text-muted">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
                    Last Profile Update
                  </span>
                  <span className="text-xs font-semibold text-foreground">{formattedUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Avatar Preview */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4 flex flex-col items-center justify-center">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider self-start">
            User Avatar
          </h3>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface flex items-center justify-center h-48 w-48 shadow-inner mt-4">
            {user.imageUrl && !imageError ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center text-primary">
                <UserIcon className="h-20 w-20 stroke-[1.2]" />
              </div>
            )}
          </div>
          <span className="text-xs text-muted mt-2 font-medium">{roleLabels[user.role]}</span>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
