import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, type CreatePostDto, type PostsResponse, type Post } from "@/entities/post"
import { type UsersResponse } from "@/entities/user"
import { type UsePostsListParams } from "../../posts-list/model/use-posts-list"

/**
 * 게시물 추가 훅 (낙관적 업데이트)
 */
export const useAddPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.createPost(data),
    onMutate: async (variables) => {
      // 1. 모든 posts 캐시에서 최대 ID 찾기
      const allCaches = queryClient.getQueriesData<PostsResponse>({ queryKey: ["posts", "list"] })
      let maxId = 251 // dummyjson의 실제 최대 게시물 ID

      for (const [, data] of allCaches) {
        if (data?.posts && data.posts.length > 0) {
          const cacheMaxId = Math.max(...data.posts.map((p) => p.id))
          maxId = Math.max(maxId, cacheMaxId)
        }
      }

      const tempId = maxId + 1 // 최대 ID + 1 (252부터 시작)

      // 2. Users 캐시에서 현재 사용자 정보 가져오기
      const usersData = queryClient.getQueryData<UsersResponse>(["users", "list"])
      const currentUser = usersData?.users.find((u) => u.id === variables.userId)

      // 3. 임시 게시물 생성
      const tempPost: Post = {
        id: tempId,
        title: variables.title,
        body: variables.body,
        userId: variables.userId,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        author: currentUser
          ? {
              id: currentUser.id,
              username: currentUser.username,
              image: currentUser.image,
            }
          : undefined,
      }

      const previousCaches: Array<[readonly unknown[], PostsResponse | undefined]> = []

      // 5. 각 캐시에 대해 낙관적 업데이트
      for (const [queryKey, oldData] of allCaches) {
        if (!oldData) continue

        // 이전 캐시 스냅샷 저장
        await queryClient.cancelQueries({ queryKey })
        previousCaches.push([queryKey, oldData])

        // 검색이나 태그 필터가 있는 캐시는 스킵 (매칭 여부를 알 수 없음)
        const params = queryKey[2] as UsePostsListParams
        if (params.searchQuery || params.selectedTag) {
          continue
        }

        // 일반 목록 캐시에만 게시물 추가 (맨 앞에 추가)
        queryClient.setQueryData<PostsResponse>(queryKey, {
          ...oldData,
          posts: [tempPost, ...oldData.posts],
          total: oldData.total + 1,
        })
      }

      // 6. context 반환 (rollback용)
      return { previousCaches }
    },
    onError: (_error, _variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context?.previousCaches) {
        for (const [queryKey, oldData] of context.previousCaches) {
          if (oldData) {
            queryClient.setQueryData(queryKey, oldData)
          }
        }
      }
    },
  })
}
