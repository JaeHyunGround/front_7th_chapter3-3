import { useQuery } from "@tanstack/react-query"
import { userApi } from "@/entities/user"

/**
 * 사용자 목록 조회 훅
 */
export const useUsersList = () => {
  return useQuery({
    queryKey: ["users", "list"],
    queryFn: () => userApi.fetchUsers(),
  })
}
