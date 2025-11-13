import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'

/**
 * Order item name max length 250 characters
 * https://docs.stripe.com/upgrades
 *
 * @type {250}
 */
export const ORDER_NAME_MAX_LENGTH = 250

/**
 * Order item description max length 500 characters
 * https://docs.stripe.com/api/metadata
 *
 * @type {500}
 */
export const ORDER_DESCRIPTION_MAX_LENGTH = 500

/**
 * Create Checkout Session.
 *
 * @param {lebobeautycoTypes.CreatePaymentPayload} payload
 * @returns {Promise<lebobeautycoTypes.PaymentResult>}
 */
export const createCheckoutSession = async (payload: lebobeautycoTypes.CreatePaymentPayload): Promise<lebobeautycoTypes.PaymentResult> =>
  fetchInstance
    .POST(
      '/api/create-checkout-session',
      payload
    )
    .then((res) => res.data)

/**
 * Check Checkout Session.
 *
 * @param {string} sessionId
 * @returns {Promise<number>}
 */
export const checkCheckoutSession = async (sessionId: string): Promise<number> =>
  fetchInstance
    .POST(
      `/api/check-checkout-session/${sessionId}`,
      null,
      [],
      true
    )
    .then((res) => res.status)

/**
 * Create Payment Intent.
 *
 * @param {lebobeautycoTypes.CreatePaymentPayload} payload
 * @returns {Promise<lebobeautycoTypes.CreatePaymentIntentResult>}
 */
export const createPaymentIntent = async (payload: lebobeautycoTypes.CreatePaymentPayload): Promise<lebobeautycoTypes.PaymentResult> =>
  fetchInstance
    .POST(
      '/api/create-payment-intent',
      payload
    )
    .then((res) => res.data)
