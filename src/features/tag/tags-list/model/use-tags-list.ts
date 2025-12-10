import { useQuery } from "@tanstack/react-query"
import { tagApi } from "@/entities/tag"

/**
 * 태그 목록 조회 훅
 */
export const useTagsList = () => {
  return useQuery({
    queryKey: ["tags", "list"],
    queryFn: () => tagApi.fetchTags(),
  })
}
