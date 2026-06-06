export default function CategoriesSection() {
  const categories = [
    {
      name: 'Weddings',
      desc: 'Beautiful venues for your special day',
    },
    {
      name: 'Corporate',
      desc: 'Professional spaces for meetings & events',
    },
    {
      name: 'Private Parties',
      desc: 'Celebrate birthdays & private gatherings',
    },
  ];

  return (
    <section className="bg-background text-foreground py-16">

      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <h2 className="text-3xl font-bold">
          Curated Categories
        </h2>

        <p className="text-muted mt-2">
          Explore venues based on your event type
        </p>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-primary">
                {cat.name}
              </h3>

              <p className="text-muted mt-2 text-sm">
                {cat.desc}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}