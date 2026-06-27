import { CreateBookingPayload } from "@/types/booking.types"
import * as bookingRepo from "@/repositories/booking.repository"


export const getBookingByVenueId = async (id: string) => {
   const bookings = await bookingRepo.getBookingByVenueId(id)
   return bookings
}

export const createBookingService = async (userId:string , payload:CreateBookingPayload) => {

}

