import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, type CreatePostDto } from "@/entities/post"

/**
 * 게시물 추가 훅
 */
export const useAddPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.createPost(data),
    onSuccess: () => {
      // 게시물 목록 캐시 무효화 - 자동으로 리페치됨
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
