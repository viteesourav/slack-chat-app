"use client";

import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

//this hooks extracts the id from the parmams and returns it.
export const useWorkSpaceId = () => {
    const{ workspaceId } = useParams();
    
    return workspaceId as Id<"workSpaces">;  //Specify the that id returned, will be a type of id from workspace table.
};