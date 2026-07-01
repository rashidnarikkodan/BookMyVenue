// client/src/features/wallet/components/EmptyWallet.tsx

import React from "react";
import { Wallet } from "lucide-react";

const EmptyWallet: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Wallet className="w-12 h-12 text-foreground/20 stroke-[1.2] mb-4" />
      <h3 className="text-base font-bold text-foreground">No Transactions Yet</h3>
      <p className="text-sm text-foreground/50 mt-1 max-w-xs leading-relaxed">
        Your booking payments, refunds, and wallet activity will appear here once you start using BookMyVenue.
      </p>
    </div>
  );
};

export default EmptyWallet;