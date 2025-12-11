import { User } from "@/entities/user"

interface PostAuthorProps {
  author?: User
  onClick?: (userId: number) => void
}

export const PostAuthor = ({ author, onClick }: PostAuthorProps) => {
  if (!author) return null

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onClick?.(author.id)}
    >
      <img src={author.image} alt={author.username} className="w-8 h-8 rounded-full" />
      <span>{author.username}</span>
    </div>
  )
}
