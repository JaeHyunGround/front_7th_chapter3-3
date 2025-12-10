/**
 * 게시물 반응 (좋아요/싫어요)
 */
export interface PostReactions {
  likes: number
  dislikes: number
}

/**
 * 게시물 엔티티
 */
export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: PostReactions
  views?: number
  author?: {
    id: number
    username: string
    image: string
  }
}

/**
 * 게시물 목록 조회 응답
 */
export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

/**
 * 게시물 생성 요청 DTO
 */
export interface CreatePostDto {
  title: string
  body: string
  userId: number
}

/**
 * 게시물 수정 요청 DTO
 */
export interface UpdatePostDto {
  title?: string
  body?: string
}
