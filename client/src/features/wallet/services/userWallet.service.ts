import apiClient from "@/services/apiClient";

export const walletApi = {
  getUserWallet: async (userId: string) => {
    const res = await apiClient.get(`/users/${userId}/wallet`);
    return res.data;
  },
};