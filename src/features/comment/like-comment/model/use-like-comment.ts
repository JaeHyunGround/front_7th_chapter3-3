import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, type UpdateCommentLikesDto } from "@/entities/comment"

/**
 * 댓글 좋아요 훅
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentLikesDto; postId: number }) =>
      commentApi.likeComment(id, data),
    onSuccess: (_, variables) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", "list", variables.postId] })
    },
  })
}
