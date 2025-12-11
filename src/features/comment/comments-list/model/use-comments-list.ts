import { useQuery } from "@tanstack/react-query"
import { commentApi, type CommentsResponse } from "@/entities/comment"

/**
 * 댓글 목록 조회 파라미터
 */
export interface UseCommentsListParams {
  postId: number
}

/**
 * 특정 게시물의 댓글 목록 조회 훅
 */
export const useCommentsList = ({ postId }: UseCommentsListParams) => {
  return useQuery({
    queryKey: ["comments", "list", postId],
    queryFn: (): Promise<CommentsResponse> => {
      // 임시 게시글(낙관적으로 추가된 게시글)인 경우 서버 호출 스킵
      // dummyjson의 실제 최대 게시물 ID는 251이므로, 252 이상은 모두 임시 게시글
      if (postId > 251) {
        return Promise.resolve({
          comments: [],
          total: 0,
          skip: 0,
          limit: 30,
        })
      }
      return commentApi.fetchCommentsByPostId(postId)
    },
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
  })
}
