import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, type UpdatePostDto, type PostsResponse } from "@/entities/post"

/**
 * 게시물 수정 훅 (낙관적 업데이트)
 */
export const useEditPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostDto }) => {
      // 임시 ID(낙관적으로 추가된 게시물)인 경우 서버 요청 스킵
      // dummyjson의 실제 최대 게시물 ID는 251이므로, 252 이상은 모두 임시 게시물
      if (id > 251) {
        return Promise.resolve({
          id,
          title: data.title || "",
          body: data.body || "",
          userId: 0,
          tags: [],
          reactions: { likes: 0, dislikes: 0 },
        })
      }
      return postApi.updatePost(id, data)
    },
    onMutate: async (variables) => {
      // 1. 모든 posts 캐시 찾기
      const allCaches = queryClient.getQueriesData<PostsResponse>({ queryKey: ["posts", "list"] })
      const previousCaches: Array<[readonly unknown[], PostsResponse | undefined]> = []

      // 2. 각 캐시에 대해 낙관적 업데이트
      for (const [queryKey, oldData] of allCaches) {
        if (!oldData) continue

        // 이전 캐시 스냅샷 저장
        await queryClient.cancelQueries({ queryKey })
        previousCaches.push([queryKey, oldData])

        // 해당 게시물이 있으면 수정
        queryClient.setQueryData<PostsResponse>(queryKey, {
          ...oldData,
          posts: oldData.posts.map((post) =>
            post.id === variables.id
              ? {
                  ...post,
                  ...(variables.data.title && { title: variables.data.title }),
                  ...(variables.data.body && { body: variables.data.body }),
                }
              : post,
          ),
        })
      }

      // 3. context 반환 (rollback용)
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
