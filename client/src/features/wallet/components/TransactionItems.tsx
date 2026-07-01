
import React from "react";
import type { WalletTransaction } from "../types";

interface TransactionItemProps {
  transaction: WalletTransaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isCredit = transaction.type === "CREDIT";

  const amountColor = isCredit ? "text-green-500 font-semibold" : "text-red-500 font-semibold";
  const sign = isCredit ? "+" : "-";

  return (
    <div className="w-full flex items-start justify-between gap-4 p-4 rounded-2xl border border-border/50 bg-surface/50 hover:bg-muted/10 transition-colors">
      
      {/* Left side */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-foreground">
          {transaction.title}
        </p>

        {transaction.description && (
          <p className="text-xs text-foreground/60">
            {transaction.description}
          </p>
        )}

        <p className="text-[11px] text-foreground/40">
          {new Date(transaction.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5">
        <p className={`text-sm ${amountColor}`}>
          {sign} ₹{transaction.amount.toLocaleString("en-IN")}
        </p>

        <span
          className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
            transaction.status === "SUCCESS"
              ? "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400"
              : transaction.status === "PENDING"
              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
              : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;