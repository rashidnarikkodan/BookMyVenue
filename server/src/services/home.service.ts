import repo from "@/repositories/home.repository";
import { VenueCardDto } from "@/dto/venue/venue-card.dto";


const getEliteVenues = async(): Promise<VenueCardDto[]>   =>  {
    return await repo.getEliteVenues();
}

export default {
    getEliteVenues
}