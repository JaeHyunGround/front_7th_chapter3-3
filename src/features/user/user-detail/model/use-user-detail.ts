import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/entities/user"

/**
 * 사용자 상세 조회 파라미터
 */
export interface UseUserDetailParams {
  userId: number
}

/**
 * 사용자 상세 정보 조회 훅
 */
export const useUserDetail = ({ userId }: UseUserDetailParams) => {
  return useQuery({
    queryKey: ["users", "detail", userId],
    queryFn: () => userApi.fetchUserById(userId),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
  })
}
