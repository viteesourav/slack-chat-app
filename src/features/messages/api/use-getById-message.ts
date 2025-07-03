import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetByIdMessageProps {
  id: Id<"messages">;
}

//This hooks brings message by Id....
export const useGetByIdMessage = ({ id }: UseGetByIdMessageProps) => {
  const data = useQuery(api.messages.getById, { id });
  const isLoading = data === undefined;

  return {
    data,
    isLoading,
  };
};
