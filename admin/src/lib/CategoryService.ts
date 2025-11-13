'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'
import * as UserService from './UserService'

/**
 * Validate category name.
 *
 * @param {lebobeautycoTypes.ValidateCategoryPayload} data
 * @returns {Promise<number>}
 */
export const validate = async (data: lebobeautycoTypes.ValidateCategoryPayload): Promise<number> =>
  fetchInstance
    .POST(
      '/api/validate-category',
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Check if a category is related to a product.
 *
 * @param {number} id
 * @returns {Promise<number>}
 */
export const check = async (id: string): Promise<number> =>
  fetchInstance
    .GET(
      `/api/check-category/${id}`,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
 * Create a category.
 *
 * @param {lebobeautycoTypes.UpsertCategoryPayload} data
 * @returns {Promise<number>}
 */
export const create = async (data: lebobeautycoTypes.UpsertCategoryPayload): Promise<number> => (
  fetchInstance
    .POST(
      '/api/create-category',
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
)

/**
 * Update a category.
 *
 * @param {string} id
 * @param {lebobeautycoTypes.UpsertCategoryPayload} data
 * @returns {Promise<number>}
 */
export const update = async (id: string, data: lebobeautycoTypes.UpsertCategoryPayload): Promise<number> => (
  fetchInstance
    .PUT(
      `/api/update-category/${id}`,
      data,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
)

/**
 * Delete a category.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const deleteCategory = async (id: string): Promise<number> => (
  fetchInstance
    .DELETE(
      `/api/delete-category/${id}`,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
)

/**
 * Get a category.
 *
 * @param {string} language
 * @param {string} id
 * @returns {Promise<lebobeautycoTypes.CategoryInfo>}
 */
export const getCategory = async (language: string, id: string): Promise<lebobeautycoTypes.CategoryInfo> => (
  fetchInstance
    .GET(
      `/api/category/${id}/${language}`,
      [await UserService.authHeader()]
    )
    .then((res) => res.data)
)

/**
 * Get categories.
 *
 * @param {string} language
 * @returns {Promise<lebobeautycoTypes.CategoryInfo[]>}
 */
export const getCategories = async (language: string): Promise<lebobeautycoTypes.CategoryInfo[]> => (
  fetchInstance.GET(
    `/api/categories/${language}/${false}`
  )
    .then((res) => res.data)
)

/**
 * Search categories.
 *
 * @param {string} language
 * @param {string} keyword
 * @returns {Promise<lebobeautycoTypes.CategoryInfo[]>}
 */
export const searchCategories = async (language: string, keyword: string): Promise<lebobeautycoTypes.CategoryInfo[]> => (
  fetchInstance
    .GET(
      `/api/search-categories/${language}/?s=${keyword}`,
      [await UserService.authHeader()]
    )
    .then((res) => res.data)
)

/**
 * Delete Location image.
 *
 * @param {string} id
 * @returns {Promise<number>}
 */
export const deleteImage = async (id: string): Promise<number> =>
  fetchInstance
    .POST(
      `/api/delete-category-image/${encodeURIComponent(id)}`,
      null,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)

/**
* Delete a temporary Car image.
*
* @param {string} image
* @returns {Promise<number>}
*/
export const deleteTempImage = async (image: string): Promise<number> =>
  fetchInstance
    .POST(
      `/api/delete-temp-category-image/${encodeURIComponent(image)}`,
      null,
      [await UserService.authHeader()],
      true
    )
    .then((res) => res.status)
