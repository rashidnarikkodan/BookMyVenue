import { Wallet, IWallet } from '../models/wallet.model';
import { WalletTransaction, IWalletTransaction } from '../models/walletTransaction.model';

export const walletRepository = {
  async findByUserId(userId: string): Promise<IWallet | null> {
    return await Wallet.findOne({ userId });
  },

  async create(walletData: Partial<IWallet>): Promise<IWallet> {
    const wallet = new Wallet(walletData);
    return await wallet.save();
  },

  async getOrCreateByUserId(userId: string): Promise<IWallet> {
    return await Wallet.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          balance: 0,
          currency: 'INR',
          status: 'ACTIVE',
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  },

  async findTransactionsByWalletId(walletId: string, limit = 50): Promise<IWalletTransaction[]> {
    return await WalletTransaction.find({ walletId }).sort({ createdAt: -1 }).limit(limit);
  },
};
