import { http } from "@/shared/api"
import type { Comment, CommentsResponse, CreateCommentDto, UpdateCommentDto, UpdateCommentLikesDto } from "../model/types"

/**
 * 댓글 API
 */
export const commentApi = {
  /**
   * 특정 게시물의 댓글 목록 조회
   */
  async fetchCommentsByPostId(postId: number): Promise<CommentsResponse> {
    return http.get<CommentsResponse>(`/api/comments/post/${postId}`, "댓글 목록을 불러오는데 실패했습니다")
  },

  /**
   * 댓글 생성
   */
  async createComment(data: CreateCommentDto): Promise<Comment> {
    return http.post<CreateCommentDto, Comment>("/api/comments/add", data, "댓글 생성에 실패했습니다")
  },

  /**
   * 댓글 수정
   */
  async updateComment(id: number, data: UpdateCommentDto): Promise<Comment> {
    return http.put<UpdateCommentDto, Comment>(`/api/comments/${id}`, data, "댓글 수정에 실패했습니다")
  },

  /**
   * 댓글 삭제
   */
  async deleteComment(id: number): Promise<void> {
    return http.delete(`/api/comments/${id}`, "댓글 삭제에 실패했습니다")
  },

  /**
   * 댓글 좋아요
   */
  async likeComment(id: number, data: UpdateCommentLikesDto): Promise<Comment> {
    return http.patch<UpdateCommentLikesDto, Comment>(`/api/comments/${id}`, data, "댓글 좋아요에 실패했습니다")
  },
}
