import { create } from "zustand"

/**
 * 사용자 상세 다이얼로그 상태
 */
interface UserDetailDialogStore {
  isOpen: boolean
  selectedUserId: number | null
  open: (userId: number) => void
  close: () => void
}

/**
 * 사용자 상세 다이얼로그 상태 관리 store
 */
export const useUserDetailDialog = create<UserDetailDialogStore>((set) => ({
  isOpen: false,
  selectedUserId: null,
  open: (userId) =>
    set({
      isOpen: true,
      selectedUserId: userId,
    }),
  close: () =>
    set({
      isOpen: false,
      selectedUserId: null,
    }),
}))
