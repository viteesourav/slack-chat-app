import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetChannelProps {
    workspaceId: Id<'workSpaces'>;
}

//This hooks brings channels belongs to the current workspace...
export const useGetChannels = ({
    workspaceId
}:UseGetChannelProps) => {
    const data = useQuery(api.channels.get, {workspaceId});
    const isLoading = data === undefined;

    return {
        data, 
        isLoading
    }
}