import { Edit2, MessageSquare } from "lucide-react"
import { Button, TableCell, TableRow } from "@/shared/ui"
import { highlightText } from "@/shared/lib"
import { type Post, PostTags, PostAuthor, PostReactionsUI } from "@/entities/post"
import { type User } from "@/entities/user"
import { DeletePostButton } from "@/features/post/delete-post/ui/delete-post-button"

interface PostTableRowProps {
  post: Post & { author?: User }
  searchQuery: string
  selectedTag: string
  onPostDetailClick: (post: Post) => void
  onEditClick: (post: Post) => void
  onDeleteClick: (id: number) => void
  onUserClick: (userId: number) => void
  onTagClick: (tag: string) => void
}

export const PostTableRow = ({
  post,
  searchQuery,
  selectedTag,
  onPostDetailClick,
  onEditClick,
  onDeleteClick,
  onUserClick,
  onTagClick,
}: PostTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>{highlightText(post.title, searchQuery)}</div>
          <PostTags tags={post.tags || []} selectedTag={selectedTag} onTagClick={onTagClick} />
        </div>
      </TableCell>
      <TableCell>
        <PostAuthor author={post.author} onClick={onUserClick} />
      </TableCell>
      <TableCell>
        <PostReactionsUI reactions={post.reactions} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onPostDetailClick(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEditClick(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <DeletePostButton handleDeletePost={() => onDeleteClick(post.id)} />
        </div>
      </TableCell>
    </TableRow>
  )
}
