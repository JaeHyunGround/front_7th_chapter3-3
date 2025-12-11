import { create } from "zustand"
import type { Post } from "@/entities/post"

/**
 * 게시물 상세 다이얼로그 상태
 */
interface PostDetailDialogStore {
  isOpen: boolean
  selectedPost: Post | null
  open: (post: Post) => void
  close: () => void
}

/**
 * 게시물 상세 다이얼로그 상태 관리 store
 */
export const usePostDetailDialog = create<PostDetailDialogStore>((set) => ({
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
