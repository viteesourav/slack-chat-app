import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Message } from "@/components/message";
import { useGetByIdMessage } from "../api/use-getById-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useState } from "react";

interface ThreadProps {
    messageId: Id<"messages">;
    onClose: () => void;
}

export const Thread = ({
    messageId,
    onClose,
}:ThreadProps) => {
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
    // fetch details for a particular message.
    const {data: message, isLoading: loadingMessage}  = useGetByIdMessage({id: messageId});
    
    const workspaceId = useWorkSpaceId();
    const {data: currentMember} = useCurrentMember({id: workspaceId});
    
    // show loading message screen...
    if(loadingMessage) {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold"> Thread</p>
                    <Button onClick={onClose} size="iconSm" variant="ghost">
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }
    

    return (
        <div className="h-full flex flex-col">
            {/* Thread header */}
            <div className="h-[49px] flex justify-between items-center px-4 border-b">
                <p className="text-lg font-bold"> Thread</p>
                <Button onClick={onClose} size="iconSm" variant="ghost">
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            {/* Thread content */}        
            {
                !message ? (
                    // If message doesnot exsits..
                    <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                        <AlertTriangle className="size-10 text-red-500/50" />
                        <p className="text-sm text-muted-foreground">Messages not found</p>
                    </div>
                ) : (
                    <div>
                        <Message
                            hideThreadButton={true}
                            memberId={message.memberId}
                            authorImage={message.user.image}
                            authorName={message.user.name}
                            isAuthor={message.memberId === currentMember?._id}
                            body={message.body} 
                            id={message._id} 
                            reactions={message.reactions} 
                            image={message.image} 
                            createdAt={message._creationTime} 
                            updatedAt={message.updatedAt} 
                            isEditing={editingId === message._id} 
                            setEditingId={setEditingId}                            
                        />
                    </div>
                )
            }

        </div>
    )
};