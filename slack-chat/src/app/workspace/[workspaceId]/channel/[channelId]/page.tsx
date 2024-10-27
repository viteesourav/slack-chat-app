'use client';

import { useGetByIdChannel } from "@/features/channels/api/use-getById-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Dice1, Loader, TriangleAlert } from "lucide-react";
import { ChannelHeader } from "./channel-header";
import { ChatInput } from "./chat-input";

const ChannelIdPage = () => {

    const channelId = useChannelId();

    //fetchs channel details based on id..
    const{data:channel, isLoading:isChannelLoading} = useGetByIdChannel({
        id: channelId
    })

    //handle Early return cases...
    if(isChannelLoading) {
        return (
            <div className="h-full flex justify-center items-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if(!channel) {
        return (
            <div className="h-full flex flex-col justify-center items-center gap-y-2">
                <TriangleAlert className="size-5 text-rose-500"/>
                <span className="text-sm font-semibold text-muted-foreground">Channel Not Found</span>
            </div>
        )
    }

    return(
        <div className="flex flex-col h-full">
            <ChannelHeader title={channel.name} />
            
            {/* the below div --> a flexible space --> Fill the whole space available */}
            <div className="flex-1" /> 

            <ChatInput
                placeholder={`Message # ${channel.name}`}
            />
        </div>
    )
}

export default ChannelIdPage;