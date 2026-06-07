import React from "react";

type Category = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

type Props = {
  category: Category;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const CategoryRow: React.FC<Props> = ({
  category,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="border-t border-border hover:bg-surface transition">
      {/* Image */}
      <td className="p-3">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-10 h-10 rounded-md object-cover"
        />
      </td>

      {/* Name + Description */}
      <td className="p-3">
        <div className="font-medium text-foreground">{category.name}</div>
        <div className="text-sm text-muted">
          {category.description}
        </div>
      </td>

      {/* Actions */}
      <td className="p-3 text-right space-x-2">
        <button
          onClick={() => onEdit?.(category.id)}
          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-accent"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete?.(category.id)}
          className="px-3 py-1 text-sm bg-error text-white rounded hover:bg-secondary"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default CategoryRow;