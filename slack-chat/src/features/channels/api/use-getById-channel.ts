import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetByIdChannelProps {
    id: Id<'channels'>;
}

//This hooks brings channels belongs to the current workspace...
export const useGetByIdChannel = ({
    id
}:UseGetByIdChannelProps) => {
    const data = useQuery(api.channels.getById, {id});
    const isLoading = data === undefined;

    return {
        data, 
        isLoading
    }
}