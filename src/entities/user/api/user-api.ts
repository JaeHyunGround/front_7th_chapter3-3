import { http } from "@/shared/api"
import type { User, UsersResponse } from "../model/types"

/**
 * 사용자 목록 조회 파라미터
 */
export interface FetchUsersParams {
  limit?: number
  skip?: number
  select?: string
}

/**
 * 사용자 API
 */
export const userApi = {
  /**
   * 사용자 목록 조회
   */
  async fetchUsers(params: FetchUsersParams = {}): Promise<UsersResponse> {
    const { limit = 0, skip = 0, select } = params
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    })

    if (select) {
      queryParams.set("select", select)
    }

    return http.get<UsersResponse>(`/api/users?${queryParams.toString()}`, "사용자 목록을 불러오는데 실패했습니다")
  },

  /**
   * 사용자 상세 정보 조회
   */
  async fetchUserById(id: number): Promise<User> {
    return http.get<User>(`/api/users/${id}`, "사용자 정보를 불러오는데 실패했습니다")
  },
}
