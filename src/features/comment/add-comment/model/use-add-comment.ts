import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, type CreateCommentDto } from "@/entities/comment"

/**
 * 댓글 추가 훅
 */
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentApi.createComment(data),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", "list", variables.postId] })
    },
  })
}
