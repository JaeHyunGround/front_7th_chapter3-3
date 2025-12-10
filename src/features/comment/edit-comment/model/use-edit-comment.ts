import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, type UpdateCommentDto } from "@/entities/comment"

/**
 * 댓글 수정 훅
 */
export const useEditComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentDto }) => commentApi.updateComment(id, data),
    onSuccess: (updatedComment) => {
      // 해당 게시물의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["comments", "list", updatedComment.postId] })
    },
  })
}
