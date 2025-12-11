import { Button } from "@/shared/ui"

interface EditPostButtonProps {
  onSubmit: () => void
}

export const EditPostButton = ({ onSubmit }: EditPostButtonProps) => {
  return <Button onClick={onSubmit}>게시물 업데이트</Button>
}
