import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UseCurrentMember {
    id: Id<'workSpaces'>
}

// custom api hook, fetches memberDetails based on currentWorkspaceId...
export const useCurrentMember = ({id}: UseCurrentMember) => {
    const data = useQuery(api.members.currentMember, {id});
    const isLoading = data === undefined;

    return {data, isLoading};
}