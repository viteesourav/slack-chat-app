"use client";

import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

//this hooks extracts the id from the parmams and returns it.
export const useMemberId = () => {
  const { memberId } = useParams();

  return memberId as Id<"members">; //Specify the that id returned, will be a type of id from channel table.
};
