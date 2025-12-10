import { useQuery } from "@tanstack/react-query"
import { postApi } from "@/entities/post"

/**
 * 게시물 목록 조회 파라미터
 */
export interface UsePostsListParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: "asc" | "desc"
  searchQuery?: string
  selectedTag?: string
}

/**
 * 게시물 목록 조회 훅
 * - searchQuery가 있으면 검색 API 호출
 * - selectedTag가 있으면 태그 필터 API 호출
 * - 둘 다 없으면 일반 목록 조회 API 호출 (sortBy, order 지원)
 */
export const usePostsList = (params: UsePostsListParams = {}) => {
  const { limit = 10, skip = 0, sortBy, order, searchQuery, selectedTag } = params

  return useQuery({
    queryKey: ["posts", "list", params],
    queryFn: () => {
      // 검색 우선
      if (searchQuery) {
        return postApi.searchPosts(searchQuery)
      }

      // 태그 필터
      if (selectedTag) {
        return postApi.fetchPostsByTag(selectedTag)
      }

      // 일반 목록 조회 (정렬 파라미터 포함)
      return postApi.fetchPosts({ limit, skip, sortBy, order })
    },
  })
}
