import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postApi, type UpdatePostDto } from "@/entities/post"

/**
 * 게시물 수정 훅
 */
export const useEditPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostDto }) => postApi.updatePost(id, data),
    onSuccess: () => {
      // 게시물 목록 캐시 무효화 - 자동으로 리페치됨
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })
}
