'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'

/**
 * Get product.
 *
 * @param {string} id
 * @param {string} language
 * @param {string} cartId
 * @returns {Promise<lebobeautycoTypes.Product>}
 */
export const getProduct = async (id: string, language: string, cartId: string, wishlistId: string): Promise<lebobeautycoTypes.Product> => {
  const data: lebobeautycoTypes.GetProductPayload = { cart: cartId, wishlist: wishlistId }

  return fetchInstance
    .POST(
      `/api/product/${id}/${language}`,
      data,
    )
    .then((res) => res.data)
}

/**
 * Get products.
 *
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @param {string} categoryId
 * @param {string} cartId
 * @returns {Promise<lebobeautycoTypes.Result<lebobeautycoTypes.Product>>}
 */
export const getProducts = async (
  keyword: string,
  page: number,
  size: number,
  categoryId: string,
  cartId: string,
  wishlistId: string,
  sortBy: lebobeautycoTypes.SortProductBy,
): Promise<lebobeautycoTypes.Result<lebobeautycoTypes.Product>> => {
  const data: lebobeautycoTypes.GetProductsPayload = { cart: cartId, wishlist: wishlistId, sortBy }

  return fetchInstance
    .POST(
      `/api/frontend-products/${page}/${size}/${(categoryId && `${categoryId}/`) || ''}${(keyword !== '' && `?s=${encodeURIComponent(keyword)}` || '')}`,
      data,
    )
    .then((res) => res.data)
}

export const getFeaturedProducts = async (
  size: number,
  cartId: string,
  wishlistId: string,
): Promise<lebobeautycoTypes.Product[]> => {
  const data: lebobeautycoTypes.GetProductsPayload = { cart: cartId, wishlist: wishlistId, size }

  return fetchInstance
    .POST(
      '/api/featured-products/',
      data,
    )
    .then((res) => res.data)
}
