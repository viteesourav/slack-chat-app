import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";

// handles parentMessageId and profileMemberId in the url...
//NOTE: At a time Right panel will show either parentMessageId [thread view] or profileMemberId [member profile view]..
export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenProfile = (memberId: string) => {
    setParentMessageId(null);
    setProfileMemberId(memberId);
  };

  const onOpenMessage = (messageId: string) => {
    setProfileMemberId(null);
    setParentMessageId(messageId);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    profileMemberId,
    onOpenProfile,
    onClose,
  };
};
