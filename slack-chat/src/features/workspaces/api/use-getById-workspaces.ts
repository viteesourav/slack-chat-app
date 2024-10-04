import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface UseGetByIdWorkspaceProps {
    id: Id<"workSpaces">
}

export const useGetByIdWorkspace = ({id}:UseGetByIdWorkspaceProps) => {
    const data = useQuery(api.workspaces.getById, {id});

    const isLoading = data === undefined;

    return {data, isLoading}
}