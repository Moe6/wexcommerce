'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

/**
 * Update an order.
 *
 * @param {string} userId
 * @param {string} orderId
 * @param {lebobeautycoTypes.OrderStatus} status
 * @returns {Promise<number>}
 */
export const updateOrder = async (userId: string, orderId: string, status: lebobeautycoTypes.OrderStatus): Promise<number> => {
  const data: lebobeautycoTypes.UpdateOrderPayload = { status }

  return fetchInstance
    .PUT(
      `/api/update-order/${userId}/${orderId}`,
      data,
      [await UserService.authHeader()],
      true,
    )
    .then((res) => res.status)
}

/**
 * Delete an order.
 *
 * @param {string} userId
 * @param {string} orderId
 * @returns {Promise<number>}
 */
export const deleteOrder = async (userId: string, orderId: string): Promise<number> =>
  fetchInstance
    .DELETE(`/api/delete-order/${userId}/${orderId}`,
      [await UserService.authHeader()]
    )
    .then((res) => res.status)

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
 * Get order by id.
 *
 * @async
 * @param {string} orderId
 * @returns {Promise<lebobeautycoTypes.Response<lebobeautycoTypes.OrderInfo>>}
 */
export const getOrder = async (orderId: string): Promise<lebobeautycoTypes.Response<lebobeautycoTypes.OrderInfo>> => {
  return fetchInstance
    .GET(
      `/api/order/${orderId}`,
      [await UserService.authHeader()]
    )
    .then((res) => ({ status: res.status, data: res.data }))
}
