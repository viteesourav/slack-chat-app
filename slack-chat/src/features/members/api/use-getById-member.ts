import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetByIdMemberProps {
  id: Id<"members">;
}

// fetch Member details by id...
export const useGetByIdMember = ({ id }: useGetByIdMemberProps) => {
  const data = useQuery(api.members.getById, {
    id,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};
