import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, type CreateCommentDto, type CommentsResponse, type Comment } from "@/entities/comment"
import { type UsersResponse } from "@/entities/user"

/**
 * 댓글 추가 훅 (낙관적 업데이트)
 */
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentApi.createComment(data),
    onMutate: async (variables) => {
      const queryKey = ["comments", "list", variables.postId]

      // 1. 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey })

      // 2. 이전 캐시 스냅샷 저장
      const previousComments = queryClient.getQueryData<CommentsResponse>(queryKey)

      // 3. Users 캐시에서 현재 사용자 정보 가져오기
      const usersData = queryClient.getQueryData<UsersResponse>(["users", "list"])
      const currentUser = usersData?.users.find((u) => u.id === variables.userId)

      // 4. 낙관적으로 캐시 업데이트 (새 댓글 추가)
      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old

        const tempComment: Comment = {
          id: Date.now(),
          body: variables.body,
          postId: variables.postId,
          userId: variables.userId,
          user: {
            id: variables.userId,
            username: currentUser?.username || "Unknown",
            image: currentUser?.image,
          },
          likes: 0,
        }

        return {
          ...old,
          comments: [...old.comments, tempComment],
          total: old.total + 1,
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
