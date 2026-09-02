import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '@/configs/env.config';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';

import logger from '@/libs/logger';

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (amount: number, receiptId: string) => {
  try {
    // Razorpay amount is in paise (minimum 100 paise = 1 INR)
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 1) {
      throw new AppError(
        `Invalid booking deposit amount: ${amount}. Minimum amount is 1 INR (100 paise).`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: receiptId.slice(0, 40), // Razorpay receipt max 40 chars
    };

    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    const razorpayDescription =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      'Failed to create Razorpay order';

    logger.error(
      {
        err: error,
        razorpayError: error?.error,
        amount,
        receiptId,
      },
      `[Razorpay Service] Order creation failed: ${razorpayDescription}`
    );

    throw new AppError(
      razorpayDescription,
      error?.statusCode || HTTP_STATUS.SERVER_ERROR
    );
  }
};

export const verifyPaymentSignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  if (!orderId || !paymentId || !signature) {
    throw new AppError('Missing signature verification fields', HTTP_STATUS.BAD_REQUEST);
  }

  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  return generatedSignature === signature;
};

export const fetchOrder = async (orderId: string) => {
  try {
    return await razorpay.orders.fetch(orderId);
  } catch (error: any) {
    logger.error({ err: error, orderId }, '[Razorpay Service] Failed to fetch order');
    throw new AppError(error?.message || 'Failed to fetch Razorpay order details', HTTP_STATUS.BAD_REQUEST);
  }
};
