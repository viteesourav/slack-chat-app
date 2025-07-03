import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface useGetByIdWorkspaceInfo {
    id: Id<"workSpaces">
}

export const useGetByIdWorkspaceInfo = ({id}:useGetByIdWorkspaceInfo) => {
    const data = useQuery(api.workspaces.getInfoById, {id});

    const isLoading = data === undefined;

    return {data, isLoading}
}