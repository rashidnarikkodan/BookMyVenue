import { useEffect, useState } from "react";
import CategoryHeader from "../components/layout/CategoryHeader";
import CategoryTable from "../components/layout/CategoryTable";
import CategoryToolbar from "../components/layout/CategoryToolbar";
import { categoriesApi } from "../services/categories.api";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortBy, setSortBy] = useState<"asc" | "desc">("asc");

  const [filter, setFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [loading, setLoading] = useState(false);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const res = await categoriesApi.getAll({
          search: debouncedSearch,
          sort: sortBy,
          status: filter,
        });

        setCategories(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [debouncedSearch, sortBy, filter]);

  return (
    <div className="space-y-6">
      <CategoryHeader />

      <CategoryToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filter={filter}
        onFilterChange={setFilter}
      />

      <CategoryTable
        categories={categories}
        onEdit={(id) => console.log("edit:", id)}
        onDelete={(id) => console.log("delete:", id)}
      />
    </div>
  );
};

export default CategoriesList;