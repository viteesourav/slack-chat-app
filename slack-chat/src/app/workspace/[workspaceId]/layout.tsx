//NOTE: like page.tsx, this also needs to have a default export...
"use clinet"; 

import React from "react";
import { Toolbar } from "./toolbar";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode
}

const WorkspaceIdLayout = ({children}:WorkspaceIdLayoutProps) => {
    return (
        <div>
            <Toolbar />
            {children}
        </div>
    );
};

export default WorkspaceIdLayout;