import { RequestHelper } from './fetchApi'
import type { MovieMetadata } from '~/domain/types'

/**
 * 导入影视
 *
 * @param movie 影视元数据
 * @returns Promise<boolean>
 */
export async function importMovie(movie: MovieMetadata): Promise<boolean> {
  const uri = `/v1/movie/import`

  await RequestHelper.postForm<boolean>(uri, movie).then(() => {
    return true
  }).catch((error) => {
    console.error(error)
    return false
  })
  return false
}
