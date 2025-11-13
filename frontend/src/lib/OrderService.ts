'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

/**
 * Checkout.
 *
 * @param {lebobeautycoTypes.User} user
 * @param {lebobeautycoTypes.OrderInfo} order
 * @returns {Promise<number>}
 */
export const checkout = async (data: lebobeautycoTypes.CheckoutPayload): Promise<{ status: number, orderId: string }> => (
  fetchInstance
    .POST(
      '/api/checkout',
      data,
      [],
    )
    .then((res) => ({ status: res.status, orderId: res.data.orderId }))
)

/**
 * Get orders.
 *
 * @param {string} userId
 * @param {number} page
 * @param {number} size
 * @param {string} keyword
 * @param {lebobeautycoTypes.PaymentType[]} paymentTypes
 * @param {lebobeautycoTypes.DeliveryType[]} deliveryTypes
 * @param {lebobeautycoTypes.OrderStatus[]} statuses
 * @param {?number} [from]
 * @param {?number} [to]
 * @returns {Promise<lebobeautycoTypes.Result<lebobeautycoTypes.OrderInfo>>}
 */
export const getOrders = async (
  userId: string,
  page: number,
  size: number,
  keyword: string,
  paymentTypes: lebobeautycoTypes.PaymentType[],
  deliveryTypes: lebobeautycoTypes.DeliveryType[],
  statuses: lebobeautycoTypes.OrderStatus[],
  sortBy: lebobeautycoTypes.SortOrderBy = lebobeautycoTypes.SortOrderBy.dateDesc,
  from?: number,
  to?: number,
): Promise<lebobeautycoTypes.Result<lebobeautycoTypes.OrderInfo>> => {
  const data: lebobeautycoTypes.GetOrdersPayload = {
    paymentTypes,
    deliveryTypes,
    statuses,
    from: from || null,
    to: to || null,
    sortBy,
  }

  return fetchInstance
    .POST(
      `/api/orders/${userId}/${page}/${size}/?s=${encodeURIComponent(keyword || '')}`,
      data,
      [await UserService.authHeader()]
    )
    .then((res) => res.data)
}

/**
 * Delete temporary Order created from checkout session.
 *
 * @param {string} orderId
 * @param {string} sessionId
 * @returns {Promise<number>}
 */
export const deleteTempOrder = async (orderId: string, sessionId: string): Promise<number> =>
  fetchInstance
    .DELETE(
      `/api/delete-temp-order/${orderId}/${sessionId}`,
      [],
      true,
    )
    .then((res) => res.status)
