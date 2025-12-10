import { create } from "zustand"

/**
 * 댓글 추가 다이얼로그 상태
 */
interface AddCommentDialogStore {
  isOpen: boolean
  postId: number | null
  open: (postId: number) => void
  close: () => void
}

/**
 * 댓글 추가 다이얼로그 상태 관리 store
 */
export const useAddCommentDialog = create<AddCommentDialogStore>((set) => ({
  isOpen: false,
  postId: null,
  open: (postId) =>
    set({
      isOpen: true,
      postId,
    }),
  close: () =>
    set({
      isOpen: false,
      postId: null,
    }),
}))
