import { create } from "zustand"

/**
 * 게시물 필터 상태
 */
interface PostsFilterStore {
  // 페이지네이션
  skip: number
  limit: number

  // 정렬
  sortBy: string
  order: "asc" | "desc"

  // 필터
  searchQuery: string
  selectedTag: string

  // 액션
  setSkip: (skip: number) => void
  setLimit: (limit: number) => void
  setSortBy: (sortBy: string) => void
  setOrder: (order: "asc" | "desc") => void
  setSearchQuery: (searchQuery: string) => void
  setSelectedTag: (selectedTag: string) => void
  resetFilters: () => void
}

/**
 * 게시물 필터 상태 관리 store
 */
export const usePostsFilterStore = create<PostsFilterStore>((set) => ({
  // 초기값
  skip: 0,
  limit: 10,
  sortBy: "",
  order: "asc",
  searchQuery: "",
  selectedTag: "",

  // 액션
  setSkip: (skip) => set({ skip }),

  setLimit: (limit) =>
    set({
      limit,
      skip: 0, // limit 변경 시 첫 페이지로
    }),

  setSortBy: (sortBy) => set({ sortBy }),

  setOrder: (order) => set({ order }),

  setSearchQuery: (searchQuery) =>
    set({
      searchQuery,
      skip: 0, // 검색 시 첫 페이지로
    }),

  setSelectedTag: (selectedTag) =>
    set({
      selectedTag,
      skip: 0, // 태그 변경 시 첫 페이지로
    }),

  resetFilters: () =>
    set({
      skip: 0,
      limit: 10,
      sortBy: "",
      order: "asc",
      searchQuery: "",
      selectedTag: "",
    }),
}))
