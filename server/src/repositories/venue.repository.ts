import Venue from '@/models/venue.model';
import { VenueDocument } from '@/types/venue.types';
import { CreateVenueDTO } from '@/dto/venue/create-venue.dto';
import { UpdateVenueDTO } from '@/dto/venue/update-venue.dto';
import { GetOwnerVenuesQueryDTO } from '@/dto/venue/get-owner-venues.dto';

type Return = Promise<VenueDocument>;

export const createVenue = async (ownerId: string, venueData: CreateVenueDTO): Return => {
  return await Venue.create({ ownerId, ...venueData });
};

export const findVenueById = async (id: string): Promise<VenueDocument | null> => {
  return await Venue.findById(id).populate('categoryId', 'name');
};

export const findVenuesByOwner = async (ownerId: string, query: GetOwnerVenuesQueryDTO) => {
  const { page, limit, search, status, category, sort } = query;

  const filter: Record<string, any> = { ownerId };

  // Status filter
  if (status && status !== 'all') {
    filter.verificationStatus = status;
  }

  // Category filter
  if (category) {
    filter.categoryId = category;
  }

  // Search filter (name or description)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOption: Record<string, 1 | -1> = {
    createdAt: sort === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [venues, total] = await Promise.all([
    Venue.find(filter).populate('categoryId', 'name').sort(sortOption).skip(skip).limit(limit),
    Venue.countDocuments(filter),
  ]);

  return {
    venues,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateVenue = async (
  id: string,
  data: UpdateVenueDTO
): Promise<VenueDocument | null> => {
  return await Venue.findByIdAndUpdate(id, data, { new: true }).populate('categoryId', 'name');
};
