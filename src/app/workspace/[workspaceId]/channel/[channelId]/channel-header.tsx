import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUserConfirmation } from "@/hooks/use-user-confirm";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface ChannelHeaderProps {
    title: string;
}

export const ChannelHeader = ({
    title
}:ChannelHeaderProps) => {

    //state control for Opening the edit dialog popup ...
    const[editOpen, setEditOpen] = useState(false);
    const[value, setValue] = useState(title); //track the edit channel titlecase..
    const channelId = useChannelId();
    const workspaceId = useWorkSpaceId();
    const router = useRouter();
    const[ConfirmDialog, confirm] = useUserConfirmation(
        'Are you Sure ?',
        'This Channel and assosicated messages will be deleted'
    );
    const{mutate:updateChannel, isPending:isUpdateChannelPending} = useUpdateChannel();
    const{mutate:removeChannel, isPending:isRemovePending} = useRemoveChannel();
    const{data:currMember, isLoading:isMemberLoading} = useCurrentMember({
        id: workspaceId
    });

    //Check if the currmember is an Admin or not ?
    const isAdmin = useMemo(()=> currMember?.role === 'admin', [currMember?.role]);

    //Method to re-set the popup... 
    const handleCloseModal = (bool:boolean) => {    
        if(!isAdmin) return; //If not an Admin to channel --> Edit Modal will not open..
        setEditOpen(bool);
    }

    //handles the changes in the input... [use regrex to find all space and convert them to '-']
    const handleOnEdit = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value.replace(/\s+/g, '-').toLowerCase();
        setValue(val);
    }

    //Handles on Submit of the modal...
    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        updateChannel({
            name:value,
            id:channelId
        },{
            onSuccess:(channelId) => {
                toast.success('Channel Updated successfully');
                setEditOpen(false);
            },
            onError: () => {
                toast.error('Failed to Update the Channel');
            }
        })

    }

    //Handle delete of channel...
    const handleDeleteChannel = async() => {
        //wait for the user to confirm deleting a channel..
        const ok  = await confirm();

        if(!ok) {
            return;
        }

        removeChannel({
            id:channelId
        },{
            onSuccess: (channelId) => {
                toast.success('Channel deleted Successfully');
                router.push(`/workspace/${workspaceId}`);  //redirect to the workspace/[workspaceId] --> Opens a new available channel.
            },
            onError: () => {
                toast.error('Failed to delete Channel');
            }
        })
    }


  return (
    <>
        <ConfirmDialog />
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                    variant={'ghost'}
                    className="text-lg font-semibold px-2 overflow-hidden w-auto"
                    >
                        <span className="truncate"># {title}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle className="">
                            # {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={handleCloseModal}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Channel Name
                                        </p>
                                        {isAdmin &&
                                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                                Edit
                                            </p>
                                        }
                                    </div>
                                    <p className="text-sm">#{title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename Channel Title</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <Input 
                                        value={value}
                                        disabled={isUpdateChannelPending}
                                        onChange = {handleOnEdit}
                                        autoFocus
                                        minLength={3}
                                        maxLength={80}
                                        placeholder="e.g. plan-budget"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant={'outline'} disabled={isUpdateChannelPending} >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdateChannelPending}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {isAdmin &&
                            <button
                                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-500"
                                onClick={handleDeleteChannel}
                            >
                                <TrashIcon className="size-4" />
                                <p className="text-sm font-semibold">Delete Channel</p>
                            </button>
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </>
  )
}
