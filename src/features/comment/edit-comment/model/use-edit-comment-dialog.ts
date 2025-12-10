import { create } from "zustand"
import type { Comment } from "@/entities/comment"

/**
 * 댓글 수정 다이얼로그 상태
 */
interface EditCommentDialogStore {
  isOpen: boolean
  selectedComment: Comment | null
  open: (comment: Comment) => void
  close: () => void
}

/**
 * 댓글 수정 다이얼로그 상태 관리 store
 */
export const useEditCommentDialog = create<EditCommentDialogStore>((set) => ({
  isOpen: false,
  selectedComment: null,
  open: (comment) =>
    set({
      isOpen: true,
      selectedComment: comment,
    }),
  close: () =>
    set({
      isOpen: false,
      selectedComment: null,
    }),
}))
