import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetByIdMember } from "@/features/members/api/use-getById-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./Header";
import { ChatInputMember } from "./chat-input-member";
import { MessageList } from "@/components/message-list";

interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
  // MemberId with whom the conversation is started..
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetByIdMember({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  // A Loader...
  if (memberLoading || status === "LoadingFirstPage") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {}}
      />
      <MessageList
        variant={"conversation"}
        memberName={member?.user.name}
        memberImage={member?.user.image}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInputMember
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
