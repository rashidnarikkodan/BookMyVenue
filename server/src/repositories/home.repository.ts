import Venue from "@/models/venue.model";
import { VenueCardDto } from "@/dto/venue/venue-card.dto";


const getEliteVenues = async(): Promise<VenueCardDto[]>  =>  {
    return  await Venue.find({
        isElite: true,
        isActive: true,
        verificationStatus: 'approved'
    })
    .select(
        'name images address.city capacity pricing isElite isFeatured'
    )
    .limit(3)
    .lean<VenueCardDto[]>();
    
}

export default {
    getEliteVenues
}