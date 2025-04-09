import { RequestHelper } from './fetchApi'
import type { MovieMetadata } from '~/domain/types'

export interface ImportMovieResponse {
  code: number
  data: boolean
  message: string
  timestamp: number
}

/**
 * 导入影视
 *
 * @param movie 影视元数据
 * @returns Promise<boolean>
 */
export async function importMovie(movie: MovieMetadata): Promise<boolean> {
  const uri = `/api/v1/movie/import`
  return RequestHelper.postForm<ImportMovieResponse>(uri, movie).then((res) => {
    if (res.code >= 200 && res.code < 300)
      return res.data
    return false
  }).catch((error) => {
    console.error(error)
    return false
  })
}
