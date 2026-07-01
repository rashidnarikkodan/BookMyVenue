export enum BookingStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  RAZORPAY = 'razorpay',
  CASH = 'cash',
  WALLET = 'wallet',
}

export enum BookingScenario {
  ADVANCE = 'ADVANCE',             // > 7 days — pay 20% now, 80% later (1 day before event)
  SHORT_NOTICE = 'SHORT_NOTICE',   // 3-7 days — pay 20% now, 80% within 24 hours
  IMMEDIATE = 'IMMEDIATE',         // < 3 days — pay 100% now
}

// Platform-wide reservation policy constants
export const RESERVATION_POLICY = {
  DEPOSIT_PERCENTAGE: 0.20,
  GST_PERCENTAGE: 0.18,
  PLATFORM_FEE_PERCENTAGE: 0.12,
  ADVANCE_THRESHOLD_DAYS: 7,
  SHORT_NOTICE_THRESHOLD_DAYS: 3,
  SHORT_NOTICE_PAYMENT_DEADLINE_HOURS: 24,
};
