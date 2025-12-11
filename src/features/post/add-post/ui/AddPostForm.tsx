import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/shared/ui"
import { User } from "@/entities/user"

interface AddPostFormProps {
  title: string
  body: string
  userId: number
  users: User[]
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onUserIdChange: (userId: number) => void
  onSubmit: () => void
}

export const AddPostForm = ({
  title,
  body,
  userId,
  users,
  onTitleChange,
  onBodyChange,
  onUserIdChange,
  onSubmit,
}: AddPostFormProps) => {
  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={title} onChange={(e) => onTitleChange(e.target.value)} />
      <Textarea rows={10} placeholder="내용" value={body} onChange={(e) => onBodyChange(e.target.value)} />
      <Select value={userId.toString()} onValueChange={(value) => onUserIdChange(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder="작성자 선택" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id.toString()}>
              {user.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onSubmit}>게시물 추가</Button>
    </div>
  )
}
