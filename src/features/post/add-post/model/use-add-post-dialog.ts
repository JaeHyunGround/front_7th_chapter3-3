import { create } from "zustand"

/**
 * 게시물 추가 다이얼로그 상태
 */
interface AddPostDialogStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

/**
 * 게시물 추가 다이얼로그 상태 관리 store
 */
export const useAddPostDialog = create<AddPostDialogStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
