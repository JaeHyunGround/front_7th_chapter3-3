import { Button } from "@/shared/ui"
import { Trash2 } from "lucide-react"

interface DeletePostButtonProps {
  handleDeletePost: () => void
}

export const DeletePostButton = ({ handleDeletePost }: DeletePostButtonProps) => {
  return (
    <Button variant="ghost" size="sm" onClick={handleDeletePost}>
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
