import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "@/entities/comment"

/**
 * 댓글 삭제 훅
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => commentApi.deleteComment(id),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", "list", variables.postId] })
    },
  })
}
