import { Button, Textarea } from "@/shared/ui"

interface EditCommentFormProps {
  body: string
  onBodyChange: (body: string) => void
  onSubmit: () => void
}

export const EditCommentForm = ({ body, onBodyChange, onSubmit }: EditCommentFormProps) => {
  return (
    <div className="space-y-4">
      <Textarea placeholder="댓글 내용" value={body} onChange={(e) => onBodyChange(e.target.value)} />
      <Button onClick={onSubmit}>댓글 업데이트</Button>
    </div>
  )
}
