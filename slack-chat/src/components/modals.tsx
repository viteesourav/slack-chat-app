"use client";

import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
    
    const[mounted, setMounted] = useState(false);

    // The reason: Sometimes jotai gives hideration err, fix--> Make Sure Modals only work with client side rendereing...
    // useEffect with "use Client" Make it For Sure that it's rendered at client.
    useEffect(()=> {
        setMounted(true);
    }, [])

    //If not mounted, We dont even render the modals at all i.e prevent hyderation error...
    if(!mounted) {
        return null;
    }

    return (
        <>
            <CreateWorkspaceModal />
        </>
    )
}