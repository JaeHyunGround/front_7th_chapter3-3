/**
 * 댓글 작성자 정보
 */
export interface CommentUser {
  id: number
  username: string
  image?: string
}

/**
 * 댓글 엔티티
 */
export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  user: CommentUser
  likes: number
}

/**
 * 댓글 목록 조회 응답
 */
export interface CommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

/**
 * 댓글 생성 요청 DTO
 */
export interface CreateCommentDto {
  body: string
  postId: number
  userId: number
}

/**
 * 댓글 수정 요청 DTO
 */
export interface UpdateCommentDto {
  body: string
}

/**
 * 댓글 좋아요 수정 요청 DTO
 */
export interface UpdateCommentLikesDto {
  likes: number
}
