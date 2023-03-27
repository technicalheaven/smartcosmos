import { Op } from 'sequelize'
import constants from '../../middlewares/resp-handler/constants';
export interface QueryParams {
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
  search?: string
}

export interface PaginationParams {
  limit: number
  offset: number
  where: any
  order: any[]
  include: any[]
}

/**
 *
 * @param params query params from request are passed here
 * @param searchFields used to apply search upon the fields in a table
 */

export function paginator(
  params: QueryParams,
  searchFields: string[],
): PaginationParams {
  if (undefined == params.page || 0 == Number(params.page)) {
    params.page = constants.PAGINATION_START_PAGE;
  }
  if (undefined == params.limit || 0 == Number(params.limit)) {
    params.limit = constants.PAGINATION_START_MAX_LIMIT;
  }
  if (undefined == params.sortOrder) {
    params.sortOrder = constants.PAGINATION_DEFAULT_ORDER;
  }

  let nLimit: number = +params.limit
  let offset = +Math.abs(+params.page - 1) * nLimit

  let where: any = {},
    inclued: any[] = []

  if (undefined !== params.search) {
    let obj: any = {}
    let whereList = searchFields.map((field) => {
      obj = {}
      obj[field] = {
        [Op.like]: '%' + params.search + '%',
      }

      return obj
    })

    
    where[Op.or] = whereList
  }

  let query: PaginationParams = {
    limit: nLimit,
    offset,
    where,
    order:
      undefined == params.sortBy || params.sortBy.length == 0
        ? [['id', params.sortOrder]]
        : [[params.sortBy, params.sortOrder]],
    include: [],
  }

  return query
}
