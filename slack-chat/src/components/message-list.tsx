import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { Message } from "./message";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Loader } from "lucide-react";

// this gives me 2 min after which my messages will fall in default view else it will be compact view
const TIME_THRESHOLD = 2;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant = "channel",
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) => {
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const workspaceId = useWorkSpaceId();

  const { data: currentMember } = useCurrentMember({ id: workspaceId });

  // group messages based on sent-time -> {dateKey1: [message2, message1], ... }
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd"); // a date key.
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof data>
  );

  // displays the label under the message seperator --> with today, yesterday or normal date
  const formateDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMMM d"); // date-formate
  };

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {})
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // fix: sorts the dateKey for proper order in ui
        .map(([dateKey, messages]) => (
          <div key={dateKey}>
            {/* The below is the message-seperator based on message creation date */}
            <div className="text-center my-2 relative">
              <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formateDateLabel(dateKey)}
              </span>
            </div>
            {/* below is rendering actual message */}
            {messages.map((message, idx) => {
              // handling message compact and default view... -> If same user and diff in message time < TIME_THRESHOLD [compact-mode] else [default-mode]
              const prevMessage = messages[idx - 1];
              const isCompactView =
                prevMessage &&
                message?.user._id === prevMessage?.user._id &&
                differenceInMinutes(
                  new Date(message._creationTime),
                  new Date(prevMessage._creationTime)
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={message.user.name}
                  isAuthor={currentMember?._id === message.memberId}
                  reactions={message.reactions}
                  body={message.body}
                  image={message.image}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompactView}
                  hideThreadButton={variant === "thread"}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                />
                // Note: If the variant is thread, then it is a reply, You cannot see reply of a reply => hideThreadBtn is hidden if it's already a thread.
              );
            })}
          </div>
        ))}
      {/* This is my observer div to load mroe elements */}
      <div
        className="h-1"
        ref={(ele) => {
          if (ele) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && canLoadMore) {
                  loadMore();
                }
              },
              {
                threshold: 1.0,
              }
            );
            observer.observe(ele);
            return () => {
              observer.disconnect(); //clean-up
            };
          }
        }}
      />
      {/* Implementing infinite loading to load older messages at top */}
      {isLoadingMore && (
        <div className="text-center my-2 relative">
          <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
          <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
            <Loader className="size-4 animate-spin" />
          </span>
        </div>
      )}

      {/* This the channel Hero heading text */}
      {variant === "channel" && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
};
