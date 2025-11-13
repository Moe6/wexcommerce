'use server'

import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as fetchInstance from './fetchInstance'

/**
 * Get categories.
 *
 * @param {string} language
 * @returns {Promise<lebobeautycoTypes.CategoryInfo[]>}
 */
export const getCategories = async (language: string, imageRequired: boolean): Promise<lebobeautycoTypes.CategoryInfo[]> => (
  fetchInstance
    .GET(
      `/api/categories/${language}/${imageRequired}`
    )
    .then((res) => res.data)
)

/**
 * Get featured categories with products.
 *
 * @async
 * @param {string} language
 * @param {number} size
 * @param {string} cartId
 * @returns {Promise<lebobeautycoTypes.CategoryInfo[]>}
 */
export const getFeaturedCategories = async (language: string, size: number, cartId: string, wishlistId: string): Promise<lebobeautycoTypes.FeaturedCategory[]> => (
  fetchInstance
    .GET(
      `/api/featured-categories/${language}/${size}?c=${cartId}&w=${wishlistId}`
    )
    .then((res) => res.data)
)
