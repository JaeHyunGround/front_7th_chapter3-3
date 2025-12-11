import { Button, Textarea } from "@/shared/ui"

interface AddCommentFormProps {
  body: string
  onBodyChange: (body: string) => void
  onSubmit: () => void
}

export const AddCommentForm = ({ body, onBodyChange, onSubmit }: AddCommentFormProps) => {
  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" value={body} onChange={(e) => onBodyChange(e.target.value)} />
      <Button onClick={onSubmit}>댓글 추가</Button>
    </div>
  )
}
