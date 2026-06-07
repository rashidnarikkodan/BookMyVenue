import weddingImg from "@/features/home/assets/category-wedding.png";
import corporateImg from "@/features/home/assets/category-corporate.png";
import getawayImg from "@/features/home/assets/category-getaway.png";

type Category = {
  name: string;
  image: string;
};

const categories: Category[] = [
  { name: "Weddings & Receptions", image: weddingImg },
  { name: "Corporate Events", image: corporateImg },
  { name: "Private Getaways", image: getawayImg },
];

export default function CategorySection() {
  return (
    <section className="bg-transparent text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-tight">
          Curated Categories
        </h2>

        <p className="text-muted-foreground dark:text-zinc-400 mt-2 max-w-xl text-sm md:text-base">
          Whether it's a grand celebration or a high-stakes board meeting, find a space that resonates with your ambition.
        </p>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative overflow-hidden aspect-[4/5] rounded-[24px] border border-border dark:border-zinc-800/40 group cursor-pointer shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 bg-zinc-950"
            >
              {/* Category Image */}
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              
              {/* Dark overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

              {/* Text */}
              <h3 className="absolute bottom-8 left-8 text-xl md:text-2xl font-bold text-white tracking-wide">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}