import React, { useState } from 'react';
import type { Category } from '../../types';
import { Pencil, Trash2, RotateCcw, Eye, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isActionLoading?: boolean;
};

const CategoryRow: React.FC<Props> = ({
  category,
  onEdit,
  onDelete,
  onRestore,
  isActionLoading = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const formattedDate = category.createdAt
    ? new Date(category.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <tr className="border-b border-border hover:bg-surface/50 transition-colors group">
      {/* Image Column */}
      <td className="p-4 align-middle">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-border bg-background shadow-inner flex items-center justify-center">
          {category.imageUrl && !imageError ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Layers className="h-5 w-5 text-muted stroke-[1.5]" />
          )}
        </div>
      </td>

      {/* Category Name & Description */}
      <td className="p-4 align-middle">
        <div className="font-semibold text-foreground text-sm tracking-tight group-hover:text-primary transition-colors">
          {category.name}
        </div>
        <div className="max-w-xs text-xs text-muted truncate mt-0.5" title={category.description}>
          {category.description || 'No description provided.'}
        </div>
      </td>

      {/* Date Created */}
      <td className="p-4 align-middle hidden md:table-cell text-xs font-medium text-muted">
        {formattedDate}
      </td>

      {/* Status Badge */}
      <td className="p-4 align-middle">
        {category.isActive ? (
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
          {/* Details Button */}
          <Link
            to={`/admin/categories/${category.id || category._id}`}
            title="View Details"
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-foreground transition-all"
          >
            <Eye size={16} />
          </Link>

          {/* Edit Button */}
          <button
            onClick={() => onEdit?.(category)}
            disabled={isActionLoading}
            title="Edit Category"
            className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary transition-all disabled:opacity-40"
          >
            <Pencil size={16} />
          </button>

          {/* Delete / Restore Button */}
          {category.isActive ? (
            <button
              onClick={() => onDelete?.(category.id || category._id || '')}
              disabled={isActionLoading}
              title="Delete Category"
              className="rounded-lg p-2 text-muted hover:bg-error/10 hover:text-error transition-all disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              onClick={() => onRestore?.(category.id || category._id || '')}
              disabled={isActionLoading}
              title="Restore Category"
              className="rounded-lg p-2 text-muted hover:bg-success/10 hover:text-success transition-all disabled:opacity-40"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;
