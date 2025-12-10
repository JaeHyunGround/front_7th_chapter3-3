import { http } from "@/shared/api"
import type { TagsResponse } from "../model/types"

/**
 * 태그 API
 */
export const tagApi = {
  /**
   * 태그 목록 조회
   */
  async fetchTags(): Promise<TagsResponse> {
    return http.get<TagsResponse>("/api/posts/tags", "태그 목록을 불러오는데 실패했습니다")
  },
}
