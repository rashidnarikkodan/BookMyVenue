import { useState } from "react";
import kochiImg from "@/features/home/assets/hero-venue-3.png";
import trivandrumImg from "@/features/home/assets/elite-travancore.png";
import alleppeyImg from "@/features/home/assets/hero-venue-2.png";

type CityInfo = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const districts: CityInfo[] = [
  {
    id: "kochi",
    name: "Kochi",
    description: "Urban luxury and waterfront hubs.",
    image: kochiImg,
  },
  {
    id: "trivandrum",
    name: "Trivandrum",
    description: "Royal heritage and diplomatic centers.",
    image: trivandrumImg,
  },
  {
    id: "alleppey",
    name: "Alleppey & Kumarakom",
    description: "Exquisite backwater tranquility.",
    image: alleppeyImg,
  },
];

export default function ExploreVenuesSection() {
  const [activeId, setActiveId] = useState<string>("kochi");
  const activeDistrict = districts.find((d) => d.id === activeId) || districts[0];

  return (
    <section className="bg-transparent text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          Explore by District
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column - District Items */}
          <div className="flex flex-col gap-4 justify-center">
            {districts.map((d) => {
              const isActive = activeId === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveId(d.id)}
                  className={`group flex flex-col justify-center px-6 py-5 rounded-[20px] cursor-pointer transition-all duration-300 border-l-4 border-y border-r ${
                    isActive
                      ? "bg-card border-[#e21a47] shadow-md border-border dark:border-zinc-850/60"
                      : "bg-transparent border-transparent hover:bg-card/45 border-border"
                  }`}
                >
                  <h3 className={`text-lg font-bold transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {d.name}
                  </h3>
                  <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1">
                    {d.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column - Large Image */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[360px] lg:h-full bg-zinc-950 border border-border dark:border-zinc-850/40 shadow-xl">
            {districts.map((d) => (
              <img
                key={d.id}
                src={d.image}
                alt={d.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  activeId === d.id ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                }`}
              />
            ))}
            
            {/* Dark overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            
            {/* Label and Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-white bg-[#e21a47] px-2.5 py-1 rounded uppercase tracking-wider">
                Featured Spaces
              </span>
              <h4 className="text-xl font-bold text-white mt-2">
                Luxury Venues in {activeDistrict.name}
              </h4>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}