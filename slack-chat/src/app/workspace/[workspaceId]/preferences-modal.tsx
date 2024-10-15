'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogPortal,
    DialogOverlay,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useUserConfirmation } from "@/hooks/use-user-confirm";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";
import { toast } from "sonner";

interface PreferencesModalProps {
    open: boolean;
    closeModal: React.Dispatch<SetStateAction<boolean>>;
    defaultName: string;
}

// Handles the preference Modal On click of Preference Option From Workspace-header.
export const PreferencesModal = ({
    open,
    closeModal,
    defaultName
}:PreferencesModalProps) => {

    const rounter = useRouter();
    const[openEditModal, setOpenEditModal] = useState(false);
    const[workspaceTitle, setWorkspaceTitle] = useState(defaultName);
    const workspaceId = useWorkSpaceId();
    const[ConfirmDialog, confirm] = useUserConfirmation(
        "Are you Sure ?",
        "This Action is Will Remove the Workspace Permanently !"
    );

    //workspace api-hooks for updating and removing workspace..
    const{mutate: updateWorkspace, isPending: updateWorkspaceIsPending} = useUpdateWorkspace();
    const{mutate: removeWorkspace, isPending:removeWorkspaceIsPending} = useRemoveWorkspace();

   //Handles the update workspace name..
   const handleEdit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        updateWorkspace({
            id: workspaceId,
            name: workspaceTitle
        }, {
            onSuccess: (data) => {
                setOpenEditModal(false);  //close the modal window.
                toast.success('Workspace upated');
            },
            onError: () => {
                toast.error('Failed to update workspace');
            }
        }
        );
   }

   //Handles removal of the current workspace...
   const deleteWorkspace = async () => {

    //This hnalde the user action from the use-confirmation dialog --> via custom hook [useUserConfirmation]
    const ok = await confirm();
    if(!ok) {
        return;
    }

    removeWorkspace({
        id: workspaceId
    }, {
        onSuccess: (data) => {
            toast.success('Workspace deleted sucessfully');
            rounter.replace('/'); //Naviagtes the user back to app/page.tsx --> Loads the first workspace under the curr LoggedInUser.
        },
        onError: () => {
            toast.error('Failed to delete the workspace');
        }
    }
    );
}

  return (
    <>
        {/* Renders the user-confirmation-dialog */}
        <ConfirmDialog />
        {/* Handles the user-preference Dialog component */}
        <Dialog open={open} onOpenChange={closeModal}>
            <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-white">
                    <DialogTitle>
                        {workspaceTitle}
                    </DialogTitle>
                </DialogHeader>
                {/* When user clicks on this whole Edit Square --> Edit WorkSpace Details Modal must open */}
                <div className="px-4 pb-4 flex flex-col gap-y-2">
                    <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
                        <DialogTrigger asChild>
                            <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">
                                        Workspace name
                                    </p>
                                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                        Edit
                                    </p>
                                </div>
                                <div className="flex itmes-center justify-start">
                                    <p className="text-sm">
                                        {workspaceTitle}
                                    </p>
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Rename this workspace
                                </DialogTitle>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEdit}>
                                <Input 
                                    value={workspaceTitle}
                                    disabled={updateWorkspaceIsPending}
                                    onChange={(evt) => setWorkspaceTitle(evt.target.value)}
                                    required
                                    autoFocus
                                    minLength={3}
                                    maxLength={80}
                                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant='outline'
                                            disabled={updateWorkspaceIsPending}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button disabled={updateWorkspaceIsPending}>Save</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <button
                        disabled={removeWorkspaceIsPending}
                        onClick={deleteWorkspace}
                        className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                    >
                        <TrashIcon className="size-4 mt-0.5" />
                        <p
                            className="text-sm font-semibold"
                        >
                            Delete Workspace
                        </p>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}
