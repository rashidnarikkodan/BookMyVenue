export default function HeroSection() {
  return (
    <section className="bg-background text-foreground min-h-[70vh] flex items-center">
      
      <div className="max-w-6xl mx-auto px-6 w-full">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Find the perfect venue <br />
          <span className="text-primary">in Kerala</span>
        </h1>

        <p className="mt-4 text-muted">
          Discover and book venues for weddings, corporate events, and celebrations
        </p>

        {/* Search Box */}
        <div className="mt-8 bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3">

          <input
            type="text"
            placeholder="Location (e.g. Kochi)"
            className="flex-1 px-4 py-3 bg-transparent outline-none border border-border rounded-lg"
          />

          <select className="flex-1 px-4 py-3 bg-transparent border border-border rounded-lg">
            <option>Event Type</option>
            <option>Wedding</option>
            <option>Corporate</option>
            <option>Party</option>
          </select>

          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition">
            Search Venues
          </button>

        </div>

        {/* Quick tags */}
        <div className="mt-4 flex gap-3 text-sm text-muted">
          <span>Wedding</span>
          <span>•</span>
          <span>Corporate</span>
          <span>•</span>
          <span>Birthday</span>
        </div>

      </div>

    </section>
  );
}