
import React from "react";
import type { Wallet } from "../types";

interface BalanceCardProps {
  wallet: Wallet;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ wallet }) => {
  return (
    <div className="w-full rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground/60 font-medium">Wallet Balance</p>

        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          ₹{wallet.balance.toLocaleString("en-IN")}
        </h1>

        <p className="text-xs text-foreground/50">
          Available Balance • {wallet.currency}
        </p>

        <p className="text-[11px] text-foreground/40 mt-2">
          Last updated:{" "}
          {new Date(wallet.updatedAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;