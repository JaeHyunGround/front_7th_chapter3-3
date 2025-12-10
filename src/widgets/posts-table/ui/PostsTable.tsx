import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/shared/ui"
import { highlightText } from "@/shared/lib"
import { type Post } from "@/entities/post"
import {
  usePostsList,
  usePostsFilterStore,
  useAddPost,
  useAddPostDialog,
  useEditPost,
  useEditPostDialog,
  useDeletePost,
} from "@/features/post"
import { useUsersList } from "@/features/user"
import { useTagsList } from "@/features/tag"
import { PostDetailModal } from "@/widgets/post-detail-modal"
import { UserDetailModal } from "@/widgets/user-detail-modal"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export const PostsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Features - 필터 상태
  const { skip, limit, sortBy, order, searchQuery, selectedTag, setSkip, setLimit, setSortBy, setOrder, setSearchQuery, setSelectedTag } =
    usePostsFilterStore()

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    // 마운트 시 URL에서 필터 상태 복원
    const urlSkip = searchParams.get("skip")
    const urlLimit = searchParams.get("limit")
    const urlSearch = searchParams.get("search")
    const urlSortBy = searchParams.get("sortBy")
    const urlOrder = searchParams.get("order")
    const urlTag = searchParams.get("tag")

    if (urlSkip) setSkip(parseInt(urlSkip))
    if (urlLimit) setLimit(parseInt(urlLimit))
    if (urlSearch) setSearchQuery(urlSearch)
    if (urlSortBy) setSortBy(urlSortBy)
    if (urlOrder) setOrder(urlOrder as "asc" | "desc")
    if (urlTag) setSelectedTag(urlTag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 필터 상태 변경 시 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit !== 10) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (order !== "asc") params.set("order", order)
    if (selectedTag) params.set("tag", selectedTag)

    setSearchParams(params, { replace: true })
  }, [skip, limit, searchQuery, sortBy, order, selectedTag, setSearchParams])

  // Features - 데이터 조회
  const { data: postsData, isLoading } = usePostsList({ skip, limit, sortBy, order, searchQuery, selectedTag })
  const { data: usersData } = useUsersList()
  const { data: tagsData } = useTagsList()

  // Features - CRUD
  const { mutate: addPost } = useAddPost()
  const { isOpen: isAddDialogOpen, open: openAddDialog, close: closeAddDialog } = useAddPostDialog()
  const { mutate: editPost } = useEditPost()
  const { isOpen: isEditDialogOpen, selectedPost, open: openEditDialog, close: closeEditDialog } = useEditPostDialog()
  const { mutate: deletePost } = useDeletePost()

  // Local state for forms
  const [newPostForm, setNewPostForm] = useState({ title: "", body: "", userId: 1 })
  const [editPostForm, setEditPostForm] = useState({ title: "", body: "" })

  // Local state for post detail modal
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null)
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false)

  // Local state for user detail modal
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false)

  // 게시물 + 작성자 정보 조합
  const postsWithUsers = postsData?.posts.map((post) => ({
    ...post,
    author: usersData?.users.find((user) => user.id === post.userId),
  }))

  // Handlers
  const handleSearch = () => {
    // searchQuery는 이미 store에 설정되어 있음
    // usePostsList가 자동으로 리페치
  }

  const handleAddPost = () => {
    addPost(newPostForm, {
      onSuccess: () => {
        // 첫 페이지로 이동 (새 게시물 확인 가능)
        setSkip(0)
        closeAddDialog()
        setNewPostForm({ title: "", body: "", userId: 1 })
      },
    })
  }

  const handleEditPost = () => {
    if (!selectedPost) return
    editPost(
      { id: selectedPost.id, data: editPostForm },
      {
        onSuccess: () => {
          closeEditDialog()
        },
      },
    )
  }

  const handleDeletePost = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deletePost(id)
    }
  }

  const handleOpenEditDialog = (post: Post) => {
    openEditDialog(post)
    setEditPostForm({ title: post.title, body: post.body })
  }

  const handleOpenPostDetail = (post: Post) => {
    setSelectedPostForDetail(post)
    setIsPostDetailModalOpen(true)
  }

  const handleClosePostDetail = () => {
    setIsPostDetailModalOpen(false)
    setSelectedPostForDetail(null)
  }

  const handleOpenUserDetail = (userId: number) => {
    setSelectedUserId(userId)
    setIsUserDetailModalOpen(true)
  }

  const handleCloseUserDetail = () => {
    setIsUserDetailModalOpen(false)
    setSelectedUserId(null)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <Select
              value={selectedTag || "all"}
              onValueChange={(value) => {
                setSelectedTag(value === "all" ? "" : value)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tagsData?.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy || "none"}
              onValueChange={(value) => setSortBy(value === "none" ? "" : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>

            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-[150px]">작성자</TableHead>
                  <TableHead className="w-[150px]">반응</TableHead>
                  <TableHead className="w-[150px]">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsWithUsers?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{highlightText(post.title, searchQuery)}</div>
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                                selectedTag === tag
                                  ? "text-white bg-blue-500 hover:bg-blue-600"
                                  : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                              }`}
                              onClick={() => setSelectedTag(tag)}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => post.author && handleOpenUserDetail(post.author.id)}
                      >
                        <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                        <span>{post.author?.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.reactions?.likes || 0}</span>
                        <ThumbsDown className="w-4 h-4" />
                        <span>{post.reactions?.dislikes || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenPostDetail(post)}>
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEditDialog(post)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* 페이지네이션 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= (postsData?.total || 0)} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => !open && closeAddDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={newPostForm.title}
              onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
            />
            <Textarea
              rows={10}
              placeholder="내용"
              value={newPostForm.body}
              onChange={(e) => setNewPostForm({ ...newPostForm, body: e.target.value })}
            />
            <Select
              value={newPostForm.userId.toString()}
              onValueChange={(value) => setNewPostForm({ ...newPostForm, userId: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="작성자 선택" />
              </SelectTrigger>
              <SelectContent>
                {usersData?.users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddPost}>게시물 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 대화상자 */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="제목"
              value={editPostForm.title}
              onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
            />
            <Textarea
              rows={10}
              placeholder="내용"
              value={editPostForm.body}
              onChange={(e) => setEditPostForm({ ...editPostForm, body: e.target.value })}
            />
            <Button onClick={handleEditPost}>게시물 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 모달 */}
      <PostDetailModal
        post={selectedPostForDetail}
        isOpen={isPostDetailModalOpen}
        onClose={handleClosePostDetail}
        searchQuery={searchQuery}
      />

      {/* 사용자 상세 모달 */}
      <UserDetailModal
        userId={selectedUserId}
        isOpen={isUserDetailModalOpen}
        onClose={handleCloseUserDetail}
      />
    </Card>
  )
}
