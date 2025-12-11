import { Button, Input, Textarea } from "@/shared/ui"

interface EditPostFormProps {
  title: string
  body: string
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onSubmit: () => void
}

export const EditPostForm = ({ title, body, onTitleChange, onBodyChange, onSubmit }: EditPostFormProps) => {
  return (
    <div className="space-y-4">
      <Input placeholder="제목" value={title} onChange={(e) => onTitleChange(e.target.value)} />
      <Textarea rows={10} placeholder="내용" value={body} onChange={(e) => onBodyChange(e.target.value)} />
      <Button onClick={onSubmit}>게시물 업데이트</Button>
    </div>
  )
}
