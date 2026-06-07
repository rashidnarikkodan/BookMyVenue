import React from "react";
import CategoryRow from "./CategoryRow";
import type { Category } from "../../types";
import { FolderOpen } from "lucide-react";

type Props = {
  categories: Category[];
  onEdit?: (category: Category) => void;
  onDelete?: (id: string) => void;
  onRestore?: (id: string) => void;
  isActionLoading?: boolean;
};

const CategoryTable: React.FC<Props> = ({
  categories,
  onEdit,
  onDelete,
  onRestore,
  isActionLoading,
}) => {
  return (
    <div className="overflow-hidden bg-card shadow-sm rounded-2xl border border-border transition-colors duration-250">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Header */}
          <thead className="bg-background text-xs font-bold text-muted uppercase tracking-wider border-b border-border">
            <tr>
              <th className="p-4 w-20">Image</th>
              <th className="p-4">Category</th>
              <th className="p-4 hidden md:table-cell">Date Created</th>
              <th className="p-4 w-32">Status</th>
              <th className="p-4 w-40 text-right">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="rounded-full bg-background border border-border p-4 text-muted">
                      <FolderOpen size={32} className="stroke-[1.2]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        No Categories Found
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Try adjusting your search terms or create a new category.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <CategoryRow
                  key={cat.id || cat._id}
                  category={cat}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  isActionLoading={isActionLoading}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;