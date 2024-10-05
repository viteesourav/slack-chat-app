import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { Loader, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useWorkSpaceId } from "@/hooks/use-workspace-id"
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {

    const[_open, setOpen] = useCreateWorkspaceModal(); //from workspace/store --> Handles the global state for opening the create new workspace pop-up...
    const router = useRouter(); //from next/navigation to naviagte...

    const workspaceId = useWorkSpaceId(); //fetches the current workspace Id...
    const {data:currWorkspaceData, isLoading:currWorkspaceIsLoading} = useGetByIdWorkspace({id: workspaceId}); //fetches Details of the curr workspaceId..
    const {data: allWorkspaceData, isLoading: allWorkspaceIsLoading} = useGetWorkspaces(); //fetches all workspace details..

    //Removes the current workspace From the list of all workspace..
    const filteredWorkspaces = allWorkspaceData?.filter(workspace => workspace._id !== workspaceId);

  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <div className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl rounded-sm cursor-pointer flex justify-center items-center">
                {currWorkspaceIsLoading ? (
                    <Loader className="size-5 animate-spin shrink-0" />
                ):(
                    currWorkspaceData?.name.charAt(0).toUpperCase()
                )}
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className="w-64">
            <DropdownMenuItem
                className="cursor-pointer flex-col justify-start items-start capitalize"
                onClick={() => router.push(`/workspace/${currWorkspaceData?._id}`)}
            >
                {currWorkspaceData?.name}
                <span className="text-xs text-muted-foreground">
                    Active workspace
                </span>
            </DropdownMenuItem>
            {
                filteredWorkspaces?.map(workspace => (
                    <DropdownMenuItem
                        key = {workspace._id}
                        className="cursor-pointer flex justify-start items-center capitalize"
                        onClick={() => router.push(`/workspace/${workspace?._id}`)}
                    >
                        <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                            {workspace?.name.charAt(0).toUpperCase()}
                        </div>
                        {workspace?.name}
                    </DropdownMenuItem>
                ))
            }
            <DropdownMenuItem
                className="cursor-pointer flex justify-start items-center"
                onClick={() => setOpen(true)}
            >
                <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                    <Plus />
                </div>
                New Workspace
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}