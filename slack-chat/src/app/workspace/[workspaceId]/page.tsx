"use client";  //**NOTE: If this is missed, useWorkSpaceId won't work  */

import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";

const WorkSpaceIdPage = () => {
    const workspaceId = useWorkSpaceId();
    const{data, isLoading} = useGetByIdWorkspace({id: workspaceId});
    
    return (
        <div>
           <p>Details Of the WorkSpace</p>
           <p>{JSON.stringify(data)}</p> 
        </div>
    )
}

export default WorkSpaceIdPage;