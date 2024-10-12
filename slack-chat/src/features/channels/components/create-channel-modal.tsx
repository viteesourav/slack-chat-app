import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreateChannelModal } from "../store/use-create-channel-modal"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCreateChannel } from "../api/use-create-channel";
import { toast } from "sonner";

//This handles the Modal View for Adding new channel ...
export const CreateChannelModal = () => {

    const workspaceId = useWorkSpaceId();
    const [open, setOpen] = useCreateChannelModal();  //Form Jotai store for channel --> handles popup visibility... 
    const [channelName, setChannelName] = useState(''); //tracks the channel-name input binder..
    const{mutate, data, isPending} = useCreateChannel();

    //Method to re-set the popup... 
    const handleCloseModal = () => {
        setChannelName('');
        setOpen(false);
    }

    //handles the changes in the input... [use regrex to find all space and convert them to '-']
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value.replace(/\s+/g, '-').toLowerCase();
        setChannelName(val);
    }

    //Handles on Submit of the modal...
    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        mutate({
            name:channelName,
            workspaceId
        },{
            onSuccess:(id) => {
                //TODO: --> Redirect to the new Channel URL..
                handleCloseModal(); //close the create-workspace-modal..
                toast.success('Workspace Created successfully');
            }
        })

    }

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Add a Channel
                </DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input 
                    value={channelName}
                    disabled={isPending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                />
                <div className="flex justify-end">
                    <Button disabled={isPending}>
                        Create
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}
