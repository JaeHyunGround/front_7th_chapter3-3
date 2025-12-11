import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { highlightText } from "@/shared/lib"
import { type Post } from "@/entities/post"
import { CommentList } from "@/entities/comment"
import {
  useCommentsList,
  useAddComment,
  useAddCommentDialog,
  AddCommentForm,
  useEditComment,
  useEditCommentDialog,
  EditCommentForm,
  useDeleteComment,
  useLikeComment,
} from "@/features/comment"

interface PostDetailModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  searchQuery?: string
}

export const PostDetailModal = ({ post, isOpen, onClose, searchQuery = "" }: PostDetailModalProps) => {
  // Features - 댓글 조회
  const { data: commentsData } = useCommentsList({ postId: post?.id || 0 })

  // Features - 댓글 CRUD
  const { mutate: addComment } = useAddComment()
  const { isOpen: isAddCommentDialogOpen, open: openAddCommentDialog, close: closeAddCommentDialog } = useAddCommentDialog()
  const { mutate: editComment } = useEditComment()
  const { isOpen: isEditCommentDialogOpen, selectedComment, open: openEditCommentDialog, close: closeEditCommentDialog } = useEditCommentDialog()
  const { mutate: deleteComment } = useDeleteComment()
  const { mutate: likeComment } = useLikeComment()

  // Local state for forms
  const [newCommentForm, setNewCommentForm] = useState({ body: "", postId: 0, userId: 1 })
  const [editCommentForm, setEditCommentForm] = useState({ body: "" })

  // Reset form when dialog opens with new post
  useEffect(() => {
    if (post) {
      setNewCommentForm({ body: "", postId: post.id, userId: 1 })
    }
  }, [post])

  // Handlers
  const handleOpenAddCommentDialog = () => {
    if (!post) return
    openAddCommentDialog(post.id)
    setNewCommentForm({ body: "", postId: post.id, userId: 1 })
  }

  const handleAddComment = () => {
    addComment(newCommentForm, {
      onSuccess: () => {
        closeAddCommentDialog()
        setNewCommentForm({ body: "", postId: post?.id || 0, userId: 1 })
      },
    })
  }

  const handleOpenEditCommentDialog = (comment: NonNullable<typeof commentsData>["comments"][0]) => {
    openEditCommentDialog(comment)
    setEditCommentForm({ body: comment.body })
  }

  const handleEditComment = () => {
    if (!selectedComment) return
    editComment(
      { id: selectedComment.id, data: editCommentForm },
      {
        onSuccess: () => {
          closeEditCommentDialog()
        },
      },
    )
  }

  const handleDeleteComment = (commentId: number) => {
    if (!post) return
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteComment({ id: commentId, postId: post.id })
    }
  }

  const handleLikeComment = (commentId: number, currentLikes: number) => {
    if (!post) return
    likeComment({
      id: commentId,
      data: { likes: currentLikes + 1 },
      postId: post.id,
    })
  }

  if (!post) return null

  return (
    <>
      {/* 게시물 상세 모달 */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(post.title, searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(post.body, searchQuery)}</p>

            {/* 댓글 섹션 */}
            <CommentList
              comments={commentsData?.comments || []}
              searchQuery={searchQuery}
              onAdd={handleOpenAddCommentDialog}
              onEdit={handleOpenEditCommentDialog}
              onDelete={handleDeleteComment}
              onLike={handleLikeComment}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
      <Dialog open={isAddCommentDialogOpen} onOpenChange={(open) => !open && closeAddCommentDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <AddCommentForm
            body={newCommentForm.body}
            onBodyChange={(body: string) => setNewCommentForm({ ...newCommentForm, body })}
            onSubmit={handleAddComment}
          />
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog open={isEditCommentDialogOpen} onOpenChange={(open) => !open && closeEditCommentDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <EditCommentForm
            body={editCommentForm.body}
            onBodyChange={(body: string) => setEditCommentForm({ ...editCommentForm, body })}
            onSubmit={handleEditComment}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
