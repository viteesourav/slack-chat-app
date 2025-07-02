"use client"; //For that useParam used in useWorkspaceId hook, layout will mark as client render..

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { Armchair, Info, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Id } from "../../../../convex/_generated/dataModel";

export const Toolbar = () => {
  const id = useWorkSpaceId();
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const { data, isLoading } = useGetByIdWorkspace({ id });
  const { data: channels } = useGetChannels({ workspaceId: id });
  const { data: members } = useGetMembers({ workspaceId: id });

  // handles on click of channel id from search...
  const handleChannelClick = (channelId: Id<"channels">) => {
    setOpen(false);
    router.push(`/workspace/${id}/channel/${channelId}`);
  };

  // handles on click of member from search...
  const handleMemberClick = (memberId: Id<"members">) => {
    setOpen(false);
    router.push(`/workspace/${id}/members/${memberId}`);
  };

  return (
    <nav className="bg-[rgb(72,19,73)] flex item-center justify-between h-10 p-1.5">
      {/* This covers the left side empty space of the toolbar */}
      <div className="flex flex-1 space-x-3 justify-start items-center">
        <Armchair className="size-9 text-orange-300 ml-3" />
        <div className="flex item-center text-xl font-semibold text-white">
          Slack Couch
        </div>
      </div>

      {/* The search box bar */}
      <div className="min-w-[400px] max-w-[642px] grow-[2] shrink">
        <Button
          size="sm"
          className="bg-accent/25 hover:bg-accent/25 w-full flex justify-start h-7 px-2"
          onClick={() => setOpen(true)}
        >
          <Search className="size-4 text-white mr-2" />
          <span className="text-white text-xs">
            Search in {isLoading ? "Workspace" : data?.name}
          </span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Channels">
              {channels?.map((channel) => (
                <CommandItem
                  key={channel._id}
                  onSelect={() => handleChannelClick(channel._id)}
                >
                  # {channel.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Members">
              {members?.map((member) => (
                <CommandItem
                  key={member._id}
                  onSelect={() => handleMemberClick(member._id)}
                >
                  {member.user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>

      {/* The info Icon Right side Toolbar */}
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" size="iconSm">
          <Info className="size-5 text-white" />
        </Button>
      </div>
    </nav>
  );
};
