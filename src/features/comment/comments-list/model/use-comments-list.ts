import { useQuery } from "@tanstack/react-query"
import { commentApi } from "@/entities/comment"

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
    queryFn: () => commentApi.fetchCommentsByPostId(postId),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
  })
}
