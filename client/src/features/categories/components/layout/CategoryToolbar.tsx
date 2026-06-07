type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: ("asc"|"desc")) => void;
  filter: string;
  onFilterChange: (value: ("active"|"all"|"inactive")) => void;
};

const CategoryToolbar = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filter,
  onFilterChange,
}: Props) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full
            rounded-lg
            border
            border-border
            bg-background
            px-4
            py-2
            text-foreground
            placeholder:text-muted
            outline-none
            focus:border-primary
          "
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Filter */}
        <div className="min-w-[160px]">
          <select
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-border
              bg-background
              px-4
              py-2
              text-foreground
              outline-none
              focus:border-primary
            "
          >
            <option value="all">All Categories</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort */}
        <div className="min-w-[180px]">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-border
              bg-background
              px-4
              py-2
              text-foreground
              outline-none
              focus:border-primary
            "
          >
            <option value="asc">Name (A-Z)</option>
            <option value="desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryToolbar;