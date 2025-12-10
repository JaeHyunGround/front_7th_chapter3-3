import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi } from "@/entities/post"

/**
 * 게시물 삭제 훅
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: () => {
      // 게시물 목록 캐시 무효화 - 자동으로 리페치됨
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
