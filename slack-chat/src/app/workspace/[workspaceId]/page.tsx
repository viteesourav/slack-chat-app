"use client";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const WorkSpaceIdPage = () => {
  const router = useRouter(); //For navigation..
  const workspaceId = useWorkSpaceId(); //curr workspaceId

  //NOTE: If the user deletes all Channels, --> We want the user to add atleast one channel..
  const [open, setOpen] = useCreateChannelModal();

  //fetch curr workspace details...
  const { data: workspaceData, isLoading: isWorkspaceLoading } =
    useGetByIdWorkspace({
      id: workspaceId,
    });
  //fetch member details...
  const { data: currMember, isLoading: isCurrMemberLoading } = useCurrentMember(
    {
      id: workspaceId,
    }
  );
  //fetch current channel data..
  const { data: channelData, isLoading: isChannelLoading } = useGetChannels({
    workspaceId,
  });

  //It will memorise the first channelId it can get...
  const channelId = useMemo(() => channelData?.[0]?._id, [channelData]);
  const isAdmin = useMemo(
    () => currMember?.role === "admin",
    [currMember?.role]
  );

  console.log("##workpace", workspaceData);
  console.log("##isAdmin", isAdmin);
  console.log("##ChannelId", channelId);

  //This Handles the naviagtion to the first channel if it finds --> If not -> Opens the create New channel Modal.
  //NOTE: We are dealing with a lot of state dependent variable inside useEffect here --> added them in the dependency arr.
  useEffect(() => {
    //If the data is still loading...
    if (
      isWorkspaceLoading ||
      isChannelLoading ||
      isCurrMemberLoading ||
      !workspaceData
    )
      return;
    //If you find the first channel Id for that workspace...
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`); //Naviagtes to the channel Id ...
    } else if (!open && isAdmin) {
      setOpen(true); //If no Channel Found --> Open the create Channel Popup.. [Only if the member is an Admin]
    }
  }, [
    channelId,
    isWorkspaceLoading,
    isChannelLoading,
    workspaceData,
    router,
    open,
    setOpen,
    workspaceId,
    isCurrMemberLoading,
    isAdmin,
  ]);

  //If Workpsace or Channel is loading...
  if (isWorkspaceLoading || isChannelLoading || isCurrMemberLoading) {
    return (
      <div className="h-full flex-1 flex justify-center items-center flex-col gap-2">
        <Loader className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  //If the workspace itself doesnot exist. case -> If we are a member and workspace got deleted..
  if (!workspaceData || !currMember) {
    return (
      <div className="h-full flex-1 flex justify-center items-center flex-col gap-2">
        <TriangleAlert className="size-8 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-full flex-1 flex justify-center items-center flex-col gap-2">
        <TriangleAlert className="size-8 text-rose-500" />
        <span className="text-sm text-muted-foreground">
          Channel not found Or Not Selected
        </span>
      </div>
    );
  }

  /*
        At this point, we have handled most of the cases.
            1. If the channelId exisit --> It will got to the respective channel Page.
            2. If the channel and workspace data loading --> show a loading icon
            3. If the workspace doesnt exist --> Show an error message saying workspace doesnt exist
            4. If the current member is not an Admin and he has no other channel in that workspace -> Show a proper error message.
    */

  return null;
};

export default WorkSpaceIdPage;
