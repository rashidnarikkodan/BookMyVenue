const Loading = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header */}
      <div className="h-8 w-48 rounded bg-muted" />

      {/* Toolbar */}
      <div className="h-12 rounded-lg bg-muted" />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="h-12 border-b border-border bg-muted/50" />

        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-border p-4 last:border-b-0"
          >
            <div className="h-10 w-10 rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted" />
            </div>

            <div className="h-8 w-20 rounded bg-muted" />
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
