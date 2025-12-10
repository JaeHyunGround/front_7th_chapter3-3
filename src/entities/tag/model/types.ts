/**
 * 태그 엔티티
 */
export interface Tag {
  slug: string
  url: string
  name?: string
}

/**
 * 태그 목록 응답
 */
export type TagsResponse = Tag[]
