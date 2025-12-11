import { ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui"
import { highlightText } from "@/shared/lib"
import { Comment } from "../model/types"

interface CommentItemProps {
  comment: Comment
  searchQuery?: string
  onEdit: (comment: Comment) => void
  onDelete: (commentId: number) => void
  onLike: (commentId: number, currentLikes: number) => void
}

export const CommentItem = ({ comment, searchQuery = "", onEdit, onDelete, onLike }: CommentItemProps) => {
  return (
    <div className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onLike(comment.id, comment.likes)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(comment.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
