import { Star, Users, Shield } from "lucide-react";
import travancoreImg from "@/features/home/assets/elite-travancore.png";
import emeraldImg from "@/features/home/assets/hero-venue-2.png";
import mistImg from "@/features/home/assets/hero-venue-4.png";
import gourmetImg from "@/features/home/assets/elite-gourmet.png";

export default function EliteVenuesSection() {
  return (
    <section className="bg-transparent text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Centered Header with red line */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Elite Venues in Kerala
          </h2>
          <div className="w-12 h-1 bg-[#e21a47] mx-auto mt-3 rounded-full" />
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Left Large Card (3/5 width) */}
          <div className="lg:col-span-3 relative rounded-[28px] overflow-hidden aspect-[4/3] lg:h-[500px] bg-zinc-950 group cursor-pointer shadow-xl border border-border dark:border-zinc-800/40 hover:scale-[1.01] transition-all duration-300">
            {/* Image */}
            <img 
              src={travancoreImg} 
              alt="The Travancore Heritage Palace" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />

            {/* Dark overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Content overlayed at bottom */}
            <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end">
              <span className="bg-[#e21a47] text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded w-fit uppercase mb-3">
                Most Booked
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                The Travancore Heritage Palace
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs md:text-sm text-zinc-300 font-medium">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#e21a47] fill-[#e21a47]" />
                  <span>4.9 (120 reviews)</span>
                </div>
                <span className="text-zinc-600">•</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span>Up to 800 Guests</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Stack (2/5 width) */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:h-[500px]">
            
            {/* Top smaller card */}
            <div className="flex-1 flex gap-4 p-4 rounded-[24px] bg-card border border-border dark:border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 items-center group cursor-pointer min-h-[180px]">
              {/* Left Image */}
              <div className="w-1/3 aspect-[3/4] h-full rounded-2xl bg-zinc-950 relative overflow-hidden flex-shrink-0">
                <img 
                  src={emeraldImg} 
                  alt="Emerald Water-Resort" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Right Content */}
              <div className="flex-1 pr-2">
                <h4 className="text-lg font-bold text-foreground group-hover:text-[#e21a47] transition-colors leading-tight">
                  Emerald Water-Resort
                </h4>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1">
                  Kumarakom, Kerala
                </p>
                <p className="text-sm font-bold text-[#e21a47] mt-3">
                  ₹1,20,000 / Day
                </p>
              </div>
            </div>

            {/* Bottom smaller card */}
            <div className="flex-1 flex gap-4 p-4 rounded-[24px] bg-card border border-border dark:border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 items-center group cursor-pointer min-h-[180px]">
              {/* Left Image */}
              <div className="w-1/3 aspect-[3/4] h-full rounded-2xl bg-zinc-950 relative overflow-hidden flex-shrink-0">
                <img 
                  src={mistImg} 
                  alt="Mist-Valley Highlands" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Right Content */}
              <div className="flex-1 pr-2">
                <h4 className="text-lg font-bold text-foreground group-hover:text-[#e21a47] transition-colors leading-tight">
                  Mist-Valley Highlands
                </h4>
                <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-1">
                  Munnar, Kerala
                </p>
                <p className="text-sm font-bold text-[#e21a47] mt-3">
                  ₹85,000 / Day
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3-Column Bottom Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Card 1: Elite Membership */}
          <div className="bg-card border border-border dark:border-zinc-850/60 rounded-[24px] p-8 flex flex-col justify-between min-h-[260px] group hover:border-zinc-800 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-background border border-border dark:bg-zinc-950/80 dark:border-zinc-800 flex items-center justify-center text-[#e21a47]">
                <Shield className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[9px] font-semibold text-muted-foreground dark:text-zinc-500 uppercase tracking-widest mt-1">
                Concierge Included
              </span>
            </div>
            
            <div className="mt-8">
              <h4 className="text-lg font-bold text-foreground">
                Elite Membership
              </h4>
              <p className="text-xs text-muted-foreground dark:text-zinc-400 mt-2 leading-relaxed">
                Access to exclusive, non-listed private properties and direct negotiation with owners.
              </p>
            </div>
          </div>

          {/* Card 2: Planning a Corporate Gala */}
          <div className="bg-[#e21a47] rounded-[24px] p-8 flex flex-col justify-between min-h-[260px] group hover:bg-[#c81239] transition-all duration-300 shadow-lg shadow-rose-950/20">
            <div>
              <h4 className="text-lg font-bold text-white">
                Planning a Corporate Gala?
              </h4>
              <p className="text-xs text-white/90 mt-2 leading-relaxed">
                Get a dedicated event coordinator for your Kochi waterfront reservation and services.
              </p>
            </div>
            
            <button className="w-full mt-6 py-3 bg-white hover:bg-zinc-100 transition-colors text-[#e21a47] font-semibold rounded-xl text-xs text-center cursor-pointer">
              Download Brochure
            </button>
          </div>

          {/* Card 3: Gourmet Dining Promo */}
          <div className="bg-zinc-950 border border-border dark:border-zinc-800/40 rounded-[24px] relative overflow-hidden flex items-center justify-center min-h-[260px] group shadow-xl">
            <img 
              src={gourmetImg} 
              alt="Gourmet Dining Experience" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Soft overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[9px] font-bold text-[#e21a47] bg-white/90 px-2 py-0.5 rounded uppercase tracking-wider">
                Elite Catering
              </span>
              <h5 className="text-sm font-bold text-white mt-1.5">
                Curated Banquet Dinners
              </h5>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}