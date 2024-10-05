//NOTE: like page.tsx, this also needs to have a default export...
"use client"; 

import React from "react";
import { Toolbar } from "./toolbar";
import { Sidebar } from "./sidebar";

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
                {children}
            </div>
        </div>
    );
};

export default WorkspaceIdLayout;