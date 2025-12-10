import { http } from "@/shared/api"
import type { Post, PostsResponse, CreatePostDto, UpdatePostDto } from "../model/types"

/**
 * 게시물 목록 조회 파라미터
 */
export interface FetchPostsParams {
  limit?: number
  skip?: number
  sortBy?: string
  order?: "asc" | "desc"
}

/**
 * 게시물 API
 */
export const postApi = {
  /**
   * 게시물 목록 조회
   */
  async fetchPosts(params: FetchPostsParams = {}): Promise<PostsResponse> {
    const { limit = 10, skip = 0, sortBy, order } = params

    // 쿼리 파라미터 구성
    let url = `/api/posts?limit=${limit}&skip=${skip}`
    if (sortBy) url += `&sortBy=${sortBy}`
    if (order) url += `&order=${order}`

    return http.get<PostsResponse>(url, "게시물 목록을 불러오는데 실패했습니다")
  },

  /**
   * 게시물 검색
   */
  async searchPosts(searchText: string): Promise<PostsResponse> {
    return http.get<PostsResponse>(
      `/api/posts/search?q=${encodeURIComponent(searchText)}`,
      "게시물 검색에 실패했습니다",
    )
  },

  /**
   * 태그별 게시물 조회
   */
  async fetchPostsByTag(tag: string): Promise<PostsResponse> {
    return http.get<PostsResponse>(
      `/api/posts/tag/${encodeURIComponent(tag)}`,
      "태그별 게시물을 불러오는데 실패했습니다",
    )
  },

  /**
   * 게시물 생성
   */
  async createPost(data: CreatePostDto): Promise<Post> {
    return http.post<CreatePostDto, Post>("/api/posts/add", data, "게시물 생성에 실패했습니다")
  },

  /**
   * 게시물 수정
   */
  async updatePost(id: number, data: UpdatePostDto): Promise<Post> {
    return http.put<UpdatePostDto, Post>(`/api/posts/${id}`, data, "게시물 수정에 실패했습니다")
  },

  /**
   * 게시물 삭제
   */
  async deletePost(id: number): Promise<void> {
    return http.delete(`/api/posts/${id}`, "게시물 삭제에 실패했습니다")
  },
}
