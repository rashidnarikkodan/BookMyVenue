import React, { useEffect, useCallback } from "react";
import { Loader2, Wallet } from "lucide-react";

import BalanceCard from "../components/BalanceCard";
import WalletCard from "../components/WalletCard";
import TransactionList from "../components/TransactionList";

import { walletApi } from "../services/userWallet.service";
import { useAsyncFetch } from "@/shared/hooks/useAsyncFetch";
import { useAppStore } from "@/store/app.store";

const UserWallet: React.FC = () => {
  const { data, loading, error, execute } = useAsyncFetch<any>();
  const user = useAppStore((state) => state.user);
  const userId = user?._id;

  const fetchWallet = useCallback(() => {
    if (userId) {
      execute(() => walletApi.getUserWallet(userId));
    }
  }, [execute, userId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-foreground/75 font-semibold animate-pulse">Loading wallet details...</p>
      </div>
    );
  }

  if (error || !userId) {
    return (
      <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-surface border border-border rounded-3xl shadow-sm">
          <Wallet className="w-12 h-12 text-error mb-4" />
          <p className="text-error font-semibold text-lg mb-2">Failed to load wallet</p>
          <p className="text-foreground/60 text-sm max-w-md mb-6">
            {!userId ? "You must be logged in to view your wallet." : error}
          </p>
          {userId && (
            <button
              onClick={fetchWallet}
              className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  const walletData = data?.data || data;
  const { wallet, transactions } = walletData || {};

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          My Wallet
        </h1>
        <p className="mt-2 text-sm sm:text-base text-foreground/60">
          Monitor your account balance, refunds, and view your transaction history.
        </p>
      </div>

      {wallet ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <BalanceCard wallet={wallet} />
          </div>

          <div className="lg:col-span-2">
            <WalletCard>
              <TransactionList transactions={transactions || []} />
            </WalletCard>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface border border-border rounded-3xl shadow-sm">
          <Wallet className="w-12 h-12 text-foreground/30 stroke-[1.2] mb-4" />
          <h3 className="text-lg font-bold text-foreground">Wallet Unavailable</h3>
          <p className="text-sm text-foreground/60 mt-1 max-w-xs leading-relaxed">
            No wallet information is currently available for your account.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserWallet;