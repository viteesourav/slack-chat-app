import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";
import { useWorkSpaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { WorkspaceHeader } from "./wokspace-header";
import { SidebarItem } from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

export const WorkspaceSidebar = () => {

  const workspaceId = useWorkSpaceId(); //fetches the current workspaceId ...
  const[_open, setOpen] = useCreateChannelModal(); //handles the popup visibility for CreateChannelModal...

  const{data: member, isLoading: memberIsLoading} = useCurrentMember({ id:workspaceId });  //fetches current member details..  
  const{data: currWorkspace, isLoading: currWorkspaceIsLoading} = useGetByIdWorkspace({id:workspaceId});
  
  //Takes the curr workspaceId --> Retruns all associated Channels related to it..
  const{data: channels, isLoading: isChannelLoading} = useGetChannels({
    workspaceId
  });

  //Takes the curr workspaceId --> Returns all the assosicated members related to that workspace... 
  const{data: members, isLoading:membersIsLoading} = useGetMembers({
    workspaceId
  });

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
    <div className="flex flex-col bg-[#5E2C5F] h-full">
      <WorkspaceHeader 
        workspace={currWorkspace} 
        isAdmin={member.role === 'admin'} 
      />
      <div className="flex flex-col px-2 mt-3">
        {/* here sidebar --> uses creation of custom variant for buttons */}
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          variant='default'
        />
         <SidebarItem
          label="Drafts $ Sent"
          icon={SendHorizonal}
          id="drafts"
          variant='default'
        />
      </div>
      {/* Render the channels for the current Workspace... */}
      {/* NOTE: Add privileges are only For the Admin users. */}
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {
          channels?.map(item => (
            <SidebarItem
              key={item._id}
              icon={HashIcon}
              label={item.name}
              id={item._id}
            />
          ))
        }
      </WorkspaceSection>

      {/* Render all the Members for the current Workspace... */}
      <WorkspaceSection
        label="Messages"
        hint="New Message"
        onNew={()=>{}}
      >
        {
            members?.map(item => (
              <UserItem 
                key={item._id}
                id={item._id}
                label={item.user.name}
                image={item.user.image}
                variant='default'
              />
            ))
          }
      </WorkspaceSection>
    </div>
  )
}