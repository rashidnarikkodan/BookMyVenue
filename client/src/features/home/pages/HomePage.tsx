import HeroSection from "@/features/home/components/sections/HeroSection";
import CategoriesSection from "@/features/home/components/sections/CategoriesSection";
import EliteVenuesSection from "@/features/home/components/sections/EliteVenueSection";
import ExploreVenuesSection from "@/features/home/components/sections/ExploreVenuesSection";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col gap-12 md:gap-16 pb-20 overflow-x-hidden transition-colors duration-300">
      <HeroSection />
      <CategoriesSection />
      <EliteVenuesSection />
      <ExploreVenuesSection />
    </div>
  );
}