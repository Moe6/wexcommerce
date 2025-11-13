'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

/**
 * Delete temp image.
 *
 * @param {string} fileName
 * @returns {Promise<number>}
 */
export const deleteTempImage = async (fileName: string): Promise<number> =>
  fetchInstance
    .POST(
      `/api/delete-temp-image/${encodeURIComponent(fileName)}`,
      null,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Delete product image.
 *
 * @param {string} productId
 * @param {string} fileName
 * @returns {Promise<number>}
 */
export const deleteImage = async (productId: string, fileName: string): Promise<number> =>
  fetchInstance
    .POST(
      `/api/delete-image/${productId}/${encodeURIComponent(fileName)}`,
      null,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Create a product.
 *
 * @param {lebobeautycoTypes.CreateProductPayload} data
 * @returns {Promise<number>}
 */
export const createProduct = async (data: lebobeautycoTypes.CreateProductPayload): Promise<lebobeautycoTypes.Response<lebobeautycoTypes.Product>> =>
  fetchInstance
    .POST(
      '/api/create-product',
      data,
      [await UserService.authHeader()],
    )
    .then((res) => ({ status: res.status, data: res.data }))

/**
 * Update a product.
 *
 * @param {lebobeautycoTypes.UpdateProductPayload} data
 * @returns {Promise<number>}
 */
export const updateProduct = async (data: lebobeautycoTypes.UpdateProductPayload): Promise<lebobeautycoTypes.Response<lebobeautycoTypes.Product>> =>
  fetchInstance
    .PUT(
      '/api/update-product',
      data,
      [await UserService.authHeader()],
    )
    .then((res) => ({ status: res.status, data: res.data }))

/**
 * Check if a product is related to an order.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const checkProduct = async (id: string): Promise<number> =>
  fetchInstance
    .GET(
      `/api/check-product/${id}`,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Delete a product.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const deleteProduct = async (id: string): Promise<number> =>
  fetchInstance
    .DELETE(
      `/api/delete-product/${id}`,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Get a product.
 *
 * @param {string} id
 * @param {string} language
 * @returns {Promise<lebobeautycoTypes.Product>}
 */
export const getProduct = async (id: string, language: string): Promise<lebobeautycoTypes.Product> =>
  fetchInstance
    .POST(
      `/api/product/${id}/${language}`
    )
    .then((res) => res.data)

/**
 * Get products.
 *
 * @param {string} userId
 * @param {string} keyword
 * @param {number} page
 * @param {number} size
 * @param {string} categoryId
 * @returns {Promise<lebobeautycoTypes.Result<lebobeautycoTypes.Product>>}
 */
export const getProducts = async (
  userId: string,
  keyword: string,
  page: number,
  size: number,
  categoryId: string,
  sortBy?: lebobeautycoTypes.SortProductBy,
): Promise<lebobeautycoTypes.Result<lebobeautycoTypes.Product>> => {
  const data: lebobeautycoTypes.GetAdminProductsPayload = { sortBy }

  return fetchInstance
    .POST(
      `/api/admin-products/${userId}/${page}/${size}/${(categoryId && `${categoryId}/`) || ''}?s=${encodeURIComponent(keyword || '')}`
      , data
      , [await UserService.authHeader()]
    )
    .then((res) => res.data)
}
