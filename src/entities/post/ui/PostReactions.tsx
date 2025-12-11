import { ThumbsUp, ThumbsDown } from "lucide-react"
import { PostReactions as PostReactionsType } from "../model/types"

interface PostReactionsProps {
  reactions?: PostReactionsType
}

export const PostReactions = ({ reactions }: PostReactionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ThumbsUp className="w-4 h-4" />
      <span>{reactions?.likes || 0}</span>
      <ThumbsDown className="w-4 h-4" />
      <span>{reactions?.dislikes || 0}</span>
    </div>
  )
}
