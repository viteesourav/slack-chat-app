"use client";

import React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspace-sidebar";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode
}

const WorkspaceIdLayout = ({children}:WorkspaceIdLayoutProps) => {
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
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

//NOTE: like page.tsx, layout.tsx also need to have a default export...
export default WorkspaceIdLayout;