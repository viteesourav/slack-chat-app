"use client";

import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./Conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkSpaceId();

  const [converstaionId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  //as the page mounts ==> fetch any existing or create a conversation
  useEffect(() => {
    mutate(
      {
        memberId,
        workspaceId,
      },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError() {
          toast.error("Failed to create or get conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  // A Loader...
  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!converstaionId) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle className="size-6 text-rose-500/70" />
        <span className="text-xs text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={converstaionId} />;
};

export default MemberIdPage;
