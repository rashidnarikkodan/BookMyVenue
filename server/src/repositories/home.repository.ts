import Venue from "@/models/venue.model";
import Category from "@/models/category.model";
import { VenueCardDto } from "@/dto/venue/venue-card.dto";
import { CategoryDocument } from "@/types/category.types";

export interface HomeDataDto {
  venues: VenueCardDto[];
  categories: CategoryDocument[];
}

const getHomeData = async (): Promise<HomeDataDto> => {
  const [venues, categories] = await Promise.all([
    Venue.find({
      isActive: true,
      verificationStatus: 'approved',
    })
      .select('name images address.city address.district capacity pricing isElite isFeatured')
      .lean<VenueCardDto[]>(),
    Category.find({
      isActive: true,
    }).lean<CategoryDocument[]>(),
  ]);

  return {
    venues,
    categories,
  };
};

export default {
  getHomeData,
};