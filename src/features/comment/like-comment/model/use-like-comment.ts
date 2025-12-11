import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, type UpdateCommentLikesDto, type CommentsResponse } from "@/entities/comment"

/**
 * 댓글 좋아요 훅 (낙관적 업데이트)
 */
export const useLikeComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentLikesDto; postId: number }) => {
      // 임시 ID(낙관적으로 추가된 댓글)인 경우 서버 요청 스킵
      // dummyjson의 실제 최대 댓글 ID는 340이므로, 341 이상은 모두 임시 댓글
      if (id > 340) {
        return Promise.resolve({ id, likes: data.likes, postId: 0, body: "", userId: 0, user: { id: 0, username: "" } })
      }
      return commentApi.likeComment(id, data)
    },
    onMutate: async (variables) => {
      const queryKey = ["comments", "list", variables.postId]

      // 1. 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey })

      // 2. 이전 캐시 스냅샷 저장
      const previousComments = queryClient.getQueryData<CommentsResponse>(queryKey)

      // 3. 낙관적으로 캐시 업데이트
      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old

        return {
          ...old,
          comments: old.comments.map((comment) =>
            comment.id === variables.id ? { ...comment, likes: variables.data.likes } : comment,
          ),
        }
      })

      // 4. context 반환 (rollback용)
      return { previousComments }
    },
    onError: (_error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", "list", variables.postId], context.previousComments)
      }
    },
  })
}
