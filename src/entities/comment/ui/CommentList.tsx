import { Plus } from "lucide-react"
import { Button } from "@/shared/ui"
import { Comment } from "../model/types"
import { CommentItem } from "./CommentItem"

interface CommentListProps {
  comments: Comment[]
  searchQuery?: string
  onAdd: () => void
  onEdit: (comment: Comment) => void
  onDelete: (commentId: number) => void
  onLike: (commentId: number, currentLikes: number) => void
}

export const CommentList = ({ comments, searchQuery, onAdd, onEdit, onDelete, onLike }: CommentListProps) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            searchQuery={searchQuery}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
          />
        ))}
      </div>
    </div>
  )
}
