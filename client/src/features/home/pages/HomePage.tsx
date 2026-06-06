import HeroSection from "@/features/home/components/sections/HeroSection";
import SearchSection from "@/features/home/components/sections/SearchSection";
import CategoriesSection from "@/features/home/components/sections/CategoriesSection";
import FeaturedVenuesSection from "@/features/home/components/sections/FeaturedVenueSection";
import NearbyVenuesSection from "@/features/home/components/sections/NearbyVenueSection";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <HeroSection />
      <SearchSection />
      <CategoriesSection />
      <FeaturedVenuesSection/>
      <NearbyVenuesSection/>
    </div>
  )
}