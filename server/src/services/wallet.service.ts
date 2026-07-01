import { walletRepository } from '@/repositories/wallet.repository';
import { IWallet } from '@/models/wallet.model';
import { IWalletTransaction } from '@/models/walletTransaction.model';

/**
 * Get the user's wallet (creating one if it doesn't exist) and its transactions
 */
export const getOrCreateUserWallet = async (
  userId: string
): Promise<{ wallet: IWallet; transactions: IWalletTransaction[] }> => {
  let wallet = await walletRepository.findByUserId(userId);
  
  if (!wallet) {
    wallet = await walletRepository.create({
      userId: userId as any,
      balance: 0,
      currency: 'INR',
      status: 'ACTIVE',
    });
  }

  const transactions = await walletRepository.findTransactionsByWalletId(wallet._id.toString());

  return { wallet, transactions };
};
