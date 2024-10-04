"use client"; //For that useParam used in useWorkspaceId hook, layout will mark as client render..

import { Button } from "@/components/ui/button"
import { useGetByIdWorkspace } from "@/features/workspaces/api/use-getById-workspaces";
import { useWorkSpaceId } from "@/hooks/use-workspace-id"
import { Info, Search } from "lucide-react"

export const Toolbar = () => {
    const id = useWorkSpaceId();
    const { data, isLoading } = useGetByIdWorkspace({id});
    return (
    <nav className="bg-[rgb(72,19,73)] flex item-center justify-between h-10 p-1.5">
        {/* This covers the left side empty space of the toolbar */}
        <div className="flex-1" />
        
        {/* The search box bar */}
        <div className="min-w-[400px] max-w-[642px] grow-[2] shrink">
            <Button size="sm" className="bg-accent/25 hover:bg-accent/25 w-full flex justify-start h-7 px-2">
                <Search className="size-4 text-white mr-2" />
                <span className="text-white text-xs">
                    Search in {isLoading ? 'Workspace' : data?.name}
                </span>
            </Button>
        </div>
        
        {/* The info Icon Right side Toolbar */}
        <div className="ml-auto flex flex-1 items-center justify-end">
            <Button variant='transparent' size='iconSm'>
                <Info className="size-5 text-white" />
            </Button>
        </div>
    </nav>
    )
}