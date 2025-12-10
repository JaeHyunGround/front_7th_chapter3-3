import { create } from "zustand"
import type { Post } from "@/entities/post"

/**
 * 게시물 수정 다이얼로그 상태
 */
interface EditPostDialogStore {
  isOpen: boolean
  selectedPost: Post | null
  open: (post: Post) => void
  close: () => void
}

/**
 * 게시물 수정 다이얼로그 상태 관리 store
 */
export const useEditPostDialog = create<EditPostDialogStore>((set) => ({
  isOpen: false,
  selectedPost: null,
  open: (post) =>
    set({
      isOpen: true,
      selectedPost: post,
    }),
  close: () =>
    set({
      isOpen: false,
      selectedPost: null,
    }),
}))
