import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"

interface InviteModalProps {
  open: boolean;
  closeModal:(open:boolean) => void;
}

//This handles the modal to Invite new Members to the workspace..
export const InviteModal = ({
  open,
  closeModal
}:InviteModalProps) => {
  return (
    <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent>
            <DialogHeader>
                Invite Members
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
