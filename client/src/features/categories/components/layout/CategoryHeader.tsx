import { useState } from "react";
import AddEditModal from "../ui/AddEditModal";

const CategoryHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-gray-500">
            Manage all product categories
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-black hover:bg-primary text-white rounded-md"
        >
          + Add Category
        </button>
      </div>

      {/* Modal */}
      {open && <AddEditModal setOpen={setOpen}/> }
    </>
  );
};

export default CategoryHeader;