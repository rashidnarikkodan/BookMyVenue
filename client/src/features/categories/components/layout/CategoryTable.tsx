import React from "react";
import CategoryRow from "./CategoryRow";

type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type Props = {
  categories: Category[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const CategoryTable: React.FC<Props> = ({
  categories,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-card shadow-md rounded-xl border border-border">
      <table className="w-full text-left">
        
        {/* Header */}
        <thead className="bg-surface text-sm text-foreground/80 uppercase tracking-wide">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Category</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-6 text-center text-muted">
                No categories found
              </td>
            </tr>
          ) : (
            categories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;