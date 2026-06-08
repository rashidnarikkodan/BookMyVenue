import { useState } from 'react';
import type { Venue } from '@/features/venues/types/venues.types';
import kochiImg from '@/features/home/assets/hero-venue-3.png';
import trivandrumImg from '@/features/home/assets/elite-travancore.png';
import alleppeyImg from '@/features/home/assets/hero-venue-2.png';

type CityInfo = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const districts: CityInfo[] = [
  {
    id: 'kochi',
    name: 'Kochi',
    description: 'Urban luxury and waterfront hubs.',
    image: kochiImg,
  },
  {
    id: 'trivandrum',
    name: 'Trivandrum',
    description: 'Royal heritage and diplomatic centers.',
    image: trivandrumImg,
  },
  {
    id: 'alleppey',
    name: 'Alleppey & Kumarakom',
    description: 'Exquisite backwater tranquility.',
    image: alleppeyImg,
  },
];

interface ExploreVenuesSectionProps {
  venues: Venue[];
  loading: boolean;
}

export default function ExploreVenuesSection({ venues, loading }: ExploreVenuesSectionProps) {
  const [activeId, setActiveId] = useState<string>('kochi');
  const activeDistrict = districts.find((d) => d.id === activeId) || districts[0];

  // Filter venues in memory for the active district
  const districtVenues = venues.filter((v) => {
    const districtName = v.address?.district?.toLowerCase() || '';
    const cityName = v.address?.city?.toLowerCase() || '';
    const active = activeId.toLowerCase();

    return districtName.includes(active) || cityName.includes(active);
  });

  return (
    <section className="bg-transparent text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header matching Featured style */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
              Regional Spaces
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-black dark:text-white leading-none">
            Explore <br />
            <span className="text-[#e21a47]">
              by District
            </span>
          </h2>
        </div>

        <div className="mt-8 mb-10 border-t border-[#e21a47]/5 dark:border-zinc-800" />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column - District Items */}
          <div className="flex flex-col gap-4 justify-center">
            {districts.map((d) => {
              const isActive = activeId === d.id;
              // Calculate count of venues in memory for this district item
              const count = venues.filter((v) => {
                const districtName = v.address?.district?.toLowerCase() || '';
                const cityName = v.address?.city?.toLowerCase() || '';
                const matchVal = d.id.toLowerCase();
                return districtName.includes(matchVal) || cityName.includes(matchVal);
              }).length;

              return (
                <div
                  key={d.id}
                  onClick={() => setActiveId(d.id)}
                  className={`group flex flex-col justify-center px-6 py-5 rounded-[20px] cursor-pointer transition-all duration-300 border-l-4 ${isActive
                      ? 'bg-card border-[#e21a47] shadow-md border-y border-r'
                      : 'bg-transparent border-l-transparent border-y border-r border-zinc-200/20 dark:border-zinc-800 hover:bg-card/45'
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <h3
                      className={`text-lg font-bold transition-colors ${isActive
                          ? 'text-foreground'
                          : 'text-black dark:text-zinc-400 group-hover:text-foreground'
                        }`}
                    >
                      {d.name}
                    </h3>
                    {!loading && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-[#e21a47]/10 text-[#e21a47] rounded-md transition-all">
                        {count} {count === 1 ? 'Venue' : 'Venues'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black dark:text-zinc-400 mt-1">
                    {d.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column - Large Image */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[360px] lg:h-full bg-zinc-950 border border-zinc-200/20 dark:border-zinc-800/40 shadow-xl">
            {districts.map((d) => (
              <img
                key={d.id}
                src={d.image}
                alt={d.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${activeId === d.id
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                  }`}
              />
            ))}

            {/* Dark overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Label and Info Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-bold text-white bg-[#e21a47] px-2.5 py-1 rounded uppercase tracking-wider">
                {loading ? 'Loading...' : `${districtVenues.length} Featured Spaces`}
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
