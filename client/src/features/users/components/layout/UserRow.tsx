import React, { useState } from 'react';
import type { User } from '../../types';
import { Trash2, RotateCcw, Eye, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  user: User;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isActionLoading?: boolean;
};

const UserRow: React.FC<Props> = ({ user, onDelete, onRestore, isActionLoading = false }) => {
  const [imageError, setImageError] = useState(false);

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  // Role Badge Color Mapper
  const roleStyles = {
    admin:
      'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/10 dark:text-purple-400',
    owner:
      'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/10 dark:text-blue-400',
    user: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:text-emerald-400',
  };

  const roleLabels = {
    admin: 'Admin',
    owner: 'Venue Owner',
    user: 'Customer',
  };

  return (
    <tr className="border-b border-border hover:bg-surface/50 transition-colors group">
      {/* Avatar Column */}
      <td className="p-4 align-middle">
        <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-border bg-background shadow-inner flex items-center justify-center">
          {user.imageUrl && !imageError ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-primary/10 to-secondary/10 flex items-center justify-center text-primary">
              <UserIcon className="h-5 w-5 stroke-[1.5]" />
            </div>
          )}
        </div>
      </td>

      {/* User Info */}
      <td className="p-4 align-middle">
        <div className="font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
          {user.name}
        </div>
        <div className="max-w-xs text-xs text-muted truncate mt-0.5" title={user.email}>
          {user.email}
        </div>
      </td>

      {/* Role */}
      <td className="p-4 align-middle hidden sm:table-cell">
        <span
          className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${roleStyles[user.role]}`}
        >
          {roleLabels[user.role]}
        </span>
      </td>

      {/* Joined Date */}
      <td className="p-4 align-middle hidden md:table-cell text-xs font-medium text-muted">
        {formattedDate}
      </td>

      {/* Status Badge */}
      <td className="p-4 align-middle">
        {user.isActive ? (
          <span className="inline-flex items-center rounded-lg border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-error/20 bg-error/10 px-2.5 py-1 text-xs font-semibold text-error">
            Inactive
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="p-4 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Details Link */}
          <Link
            to={`/admin/users/${user.id || user._id}`}
            title="View Details"
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground transition-all"
          >
            <Eye size={16} />
          </Link>

          {/* Delete / Restore */}
          {user.isActive ? (
            <button
              onClick={() => onDelete?.(user.id || user._id || '')}
              disabled={isActionLoading}
              title="Disable User"
              className="rounded-lg p-2 text-muted hover:bg-error/10 hover:text-error transition-all disabled:opacity-40 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => onRestore?.(user.id || user._id || '')}
              disabled={isActionLoading}
              title="Restore User"
              className="rounded-lg p-2 text-muted hover:bg-success/10 hover:text-success transition-all disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
