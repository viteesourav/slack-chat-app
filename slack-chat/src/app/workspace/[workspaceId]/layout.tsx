"use client";

import React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Thread } from "@/features/messages/components/thread";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode
}

const WorkspaceIdLayout = ({children}:WorkspaceIdLayoutProps) => {

    // hook handles parentMessageId with the url.
    const {parentMessageId, onOpenMessage, onClose} = usePanel(); 

    const showPanel = !!parentMessageId; //If only messageId exists, show panel

    return (
        <div>
            <Toolbar />
            {/* The height below the toolbar will the height of the curr viewport [100vh] - height given to toolbar [40px] */}
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />
                {/* autoSaveId --> Remebers for the user, what layout he saved for his workspace during multiple page-refresh */}
                <ResizablePanelGroup 
                    direction='horizontal'
                    autoSaveId="mySlackchat-workspace-layout"
                >
                    <ResizablePanel
                        defaultSize={20}
                        minSize={11}
                        className="bg-[#5E2C5F]"
                    >
                    <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        minSize={20}
                    >
                        {children}
                    </ResizablePanel>
                    {
                        showPanel && (
                            <>
                                <ResizableHandle withHandle />
                                <ResizablePanel minSize={20} defaultSize={29}>
                                    {
                                        parentMessageId ? (
                                            <Thread
                                                messageId={parentMessageId as Id<"messages">}
                                                onClose={onClose}
                                            />

                                        ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Loader className="size-5 animate-spin text-muted-foreground" />
                                        </div>
                                        )
                                    }
                                </ResizablePanel>   
                            </>
                        )
                    }
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

//NOTE: like page.tsx, layout.tsx also need to have a default export...
export default WorkspaceIdLayout;