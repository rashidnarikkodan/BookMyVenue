import { useEffect, useState, useMemo } from "react";
import CategoryHeader from "../components/layout/CategoryHeader";
import CategoryTable from "../components/layout/CategoryTable";
import CategoryToolbar from "../components/layout/CategoryToolbar";
import AddEditModal from "../components/ui/AddEditModal";
import { categoriesApi } from "../services/categories.api";
import { useAsyncFetch } from "@/shared/hooks/useAsyncFetch";
import type { Category } from "../types";
import Loading from "@/shared/components/ui/Loading";
import { toast } from "sonner";
import { Layers, CheckCircle2, AlertTriangle } from "lucide-react";

const CategoriesList = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // useAsyncFetch hooks
  const { data: listResponse, loading, execute: fetchCategories } = useAsyncFetch<{ success: boolean; message: string; data: Category[] }>();
  const { loading: actionLoading, execute: executeAction } = useAsyncFetch<any>();

  // Extract categories array
  const categories = listResponse?.data || [];

  // Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Categories function
  const loadCategories = () => {
    fetchCategories(() =>
      categoriesApi.getAll({
        search: debouncedSearch,
        sort: sortBy,
        status: filter,
      })
    );
  };

  useEffect(() => {
    loadCategories();
  }, [debouncedSearch, sortBy, filter]);

  // Delete Category (Soft Delete)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to disable this category?")) return;

    try {
      await executeAction(() => categoriesApi.remove(id));
      toast.success("Category disabled successfully");
      loadCategories();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to disable category";
      toast.error(msg);
    }
  };

  // Restore Category
  const handleRestore = async (id: string) => {
    try {
      await executeAction(() => categoriesApi.restore(id));
      toast.success("Category restored successfully");
      loadCategories();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to restore category";
      toast.error(msg);
    }
  };

  // Edit Click Handler
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  // Add Click Handler
  const handleAddClick = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  // Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: categories.length,
      active: categories.filter((c) => c.isActive).length,
      inactive: categories.filter((c) => !c.isActive).length,
    };
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <CategoryHeader onAddClick={handleAddClick} />

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Total Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Layers size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Categories
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? "..." : stats.total}
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
              Active Categories
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? "..." : stats.active}
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
              Inactive Categories
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? "..." : stats.inactive}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <CategoryToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Content Area */}
      {loading ? (
        <Loading />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onRestore={handleRestore}
          isActionLoading={actionLoading}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <AddEditModal
          category={editingCategory}
          onClose={() => {
            setModalOpen(false);
            setEditingCategory(null);
          }}
          onSuccess={loadCategories}
        />
      )}
    </div>
  );
};

export default CategoriesList;