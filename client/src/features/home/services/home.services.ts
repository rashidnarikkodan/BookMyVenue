import { apiClient } from "@/services/apiClient";

export const getEliteVenues = async () => {
    const res = await apiClient.get("/venues/elite");
    return res.data;
}   

export const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return res.data;
}

export const getCities = async () => {
    const res = await apiClient.get("/cities");
    return res.data;
}