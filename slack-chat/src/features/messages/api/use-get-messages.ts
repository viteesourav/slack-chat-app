import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 20; // min message count to load

interface UseGetMessagesProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  parentMessageId?: Id<"messages">;
}

// it's paginated so ["page"] is added, and it returns individual messages.
// Fix: Convex methods returns only the types that are in backend resp, So manually we are adding additional values here..
// Adding updated types in response.
type getMessageBaseReturnType =
  (typeof api.messages.get._returnType)["page"][number]; // get the type of  an item from the page [page: holds the paginated data]

type EnrichedMessage = getMessageBaseReturnType & {
  member: Doc<"members">;
  user: Doc<"users">;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  threadCount: number;
  threadImage?: string;
  threadTimestamp: number;
};

export type GetMessagesReturnType = EnrichedMessage[];

export const useGetMessages = ({
  channelId,
  conversationId,
  parentMessageId,
}: UseGetMessagesProps) => {
  // Handling pagianted data with Convex
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channelId, conversationId, parentMessageId },
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results: results as GetMessagesReturnType,
    status,
    loadMore: () => loadMore(BATCH_SIZE),
  };
};
