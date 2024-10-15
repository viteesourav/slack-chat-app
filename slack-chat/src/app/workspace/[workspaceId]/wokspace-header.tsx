'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Doc } from "../../../../convex/_generated/dataModel"
import { ChevronDown, ListFilter, SquarePen } from "lucide-react"
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./preferences-modal";
import { InviteModal } from "./invite-modal";
interface WorkspaceHeaderProps {
    workspace: Doc<'workSpaces'>;
    isAdmin: boolean;
}

export const WorkspaceHeader = ({workspace, isAdmin}:WorkspaceHeaderProps) => {
    
    const[isOpenPreferenceModal, setIsOpenPreferenceModal] = useState(false);
    const[isOpenInviteModal, setIsOpenInviteModal] = useState(false);

    return (
        <>
            <InviteModal open={isOpenInviteModal} closeModal={setIsOpenInviteModal} />
            <PreferencesModal open={isOpenPreferenceModal} closeModal={setIsOpenPreferenceModal} defaultName={workspace.name} />
            <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
                {/* This fix the issue with Dropdown+Dialog issue i.e when dialog closes -> Page becomes inactive */}
                <DropdownMenu modal={false}>
                    {/* NOTE: since it wraps a button, and DropdownmenuTrigger itself have a button, so hyderation issue --> sol: use aschild attribute */}
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='transparent'
                            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
                            size='sm'
                        >
                            <span className="truncate">{workspace.name}</span>
                            <ChevronDown className="size-4 ml-1 shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side='bottom'
                        align='start'
                        className='w-64'
                    >
                        <DropdownMenuItem
                            className='cursor-pointer capitalize'
                        >
                            <div className='size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className='font-bold'>{workspace.name}</p>
                                <p className='text-xs text-muted-foreground'>Active workspace</p>
                            </div>
                        </DropdownMenuItem>
                        {
                            isAdmin && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => setIsOpenInviteModal(true)}
                                >
                                    Invite People to {workspace.name}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => setIsOpenPreferenceModal(true)}
                                >
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-0.5">
                    <Hint label="Filter conversation" align='center' side='bottom'>
                        <Button
                            variant='transparent'
                            size='iconSm'
                        >
                            <ListFilter className='size-4' />
                        </Button>
                    </Hint>
                    <Hint label="New Message" align='center' side='bottom'>
                        <Button
                            variant='transparent'
                            size='iconSm'
                            >
                            <SquarePen className='size-4' />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
  )
}
