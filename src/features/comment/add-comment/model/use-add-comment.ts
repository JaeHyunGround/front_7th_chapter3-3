import { useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi, type CreateCommentDto, type CommentsResponse, type Comment } from "@/entities/comment"
import { type UsersResponse } from "@/entities/user"

/**
 * 댓글 추가 훅 (낙관적 업데이트)
 */
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto): Promise<Comment> => {
      // 임시 게시글(낙관적으로 추가된 게시글)인 경우 서버 요청 스킵
      // dummyjson의 실제 최대 게시물 ID는 251이므로, 252 이상은 모두 임시 게시글
      if (data.postId > 251) {
        return Promise.resolve({
          id: 341, // 더미 응답 (onMutate에서 실제 ID로 교체됨)
          body: data.body,
          postId: data.postId,
          userId: data.userId,
          user: { id: data.userId, username: "" },
          likes: 0,
        })
      }
      return commentApi.createComment(data)
    },
    onMutate: async (variables) => {
      const queryKey = ["comments", "list", variables.postId]

      // 1. 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey })

      // 2. 이전 캐시 스냅샷 저장
      const previousComments = queryClient.getQueryData<CommentsResponse>(queryKey)

      // 3. 모든 댓글 캐시에서 최대 ID 찾기 (전역 ID 관리)
      const allCaches = queryClient.getQueriesData<CommentsResponse>({ queryKey: ["comments", "list"] })
      let maxId = 340 // dummyjson의 실제 최대 댓글 ID

      for (const [, data] of allCaches) {
        if (data?.comments && data.comments.length > 0) {
          const cacheMaxId = Math.max(...data.comments.map((c) => c.id))
          maxId = Math.max(maxId, cacheMaxId)
        }
      }

      const tempId = maxId + 1 // 최대 ID + 1 (341부터 전역적으로 증가)

      // 4. Users 캐시에서 현재 사용자 정보 가져오기
      const usersData = queryClient.getQueryData<UsersResponse>(["users", "list"])
      const currentUser = usersData?.users.find((u) => u.id === variables.userId)

      // 5. 낙관적으로 캐시 업데이트 (새 댓글 추가)
      queryClient.setQueryData<CommentsResponse>(queryKey, (old) => {
        if (!old) return old

        const tempComment: Comment = {
          id: tempId,
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

      // 6. context 반환 (rollback용)
      return { previousComments }
    },

    onError: (_error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context && context.previousComments) {
        queryClient.setQueryData(["comments", "list", variables.postId], context.previousComments)
      }
    },
  })
}
