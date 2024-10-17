import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Doc } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useUpdateJoinCode } from "@/features/workspaces/api/use-update-joincode";
import { useUserConfirmation } from "@/hooks/use-user-confirm";

interface InviteModalProps {
  open: boolean;
  closeModal:(open:boolean) => void;
  data: Doc<'workSpaces'>
}

//This handles the modal to Invite new Members to the workspace..
export const InviteModal = ({
  open,
  closeModal,
  data
}:InviteModalProps) => {

  const workspaceId = useWorkSpaceId();

  //hook that updates current workspace's joincode..
  const {mutate, isPending} = useUpdateJoinCode();

  //Handles the confirm Dialog...
  const [ConfirmDialog, confirm] = useUserConfirmation(
    'Are you Sure ?',
    'You are going to generate a new join code'
  );

  //Method, updates the new code...
  const handleNewJoinCode = async () => {

    const ok = await confirm();  //Get the response from the Confirm Dialog...

    //If we cancel in Dialog, We return early...
    if(!ok){
      return;
    }

    mutate({
      workspaceId
    },{
      onSuccess: (data) => {
        toast.success('Invite code regenerated');
      },
      onError: () => {
        toast.error('Failed to regenerate new code');
      } 
    })
  }

  //method that handles the Invite Link...
  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    //from windows Object --> Copys the link into the clipboard.
    navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          toast.success('Invite Link Copied')
        })

  }

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={closeModal}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle> Invite Members to {data.name} </DialogTitle>
                  <DialogDescription> Use the code below to invite people to your workspace </DialogDescription>
              </DialogHeader>
              <div className='flex flex-col gap-y-4 items-center justify-center py-10'>
                <p className='text-4xl font-bold tracking-widest uppercase'>
                  {data.joinCode}
                </p>
                <Button
                  onClick={handleCopy}
                  variant='ghost'
                  size='sm'
                >
                  Copy link
                  <CopyIcon className='size-4 ml-2' />
                </Button>
              </div>
              <div className='flex items-center justify-between w-full'>
                <Button
                  onClick={handleNewJoinCode}
                  disabled={isPending}
                  variant='outline'
                >
                  New Code
                  <RefreshCcw className='size-4 ml-2' />
                </Button>
                <DialogClose asChild>
                  <Button>
                    Close
                  </Button>
                </DialogClose>
              </div>
          </DialogContent>
      </Dialog>
    </>
  )
}
