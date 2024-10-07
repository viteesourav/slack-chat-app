import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";
import { useWorkSpaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./wokspace-header";

export const WorkspaceSidebar = () => {

  const workspaceId = useWorkSpaceId(); //fetches the current workspaceId ...

  const{data: member, isLoading: memberIsLoading} = useCurrentMember({ id:workspaceId });  //fetches current member details..  
  const{data: currWorkspace, isLoading: currWorkspaceIsLoading} = useGetByIdWorkspace({id:workspaceId});

  //handle when data is loading...
  if(memberIsLoading || currWorkspaceIsLoading) {
    return (
        <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
            <Loader className="size-5 animate-spin text-white" />
        </div>
    )
  }
  
  //handle when data is not present...
  if(!member || !currWorkspace){
    return (
        <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
           <AlertTriangle className="size-8 text-red-600" />
           <p className="text-sm text-white">Failed to Load the Workspace</p>
        </div>
    )
  }

  return (
    <WorkspaceHeader workspace={currWorkspace} isAdmin={member.role === 'admin'} />
  )
}