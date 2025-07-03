import dynamic from "next/dynamic";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { Message } from "@/components/message";
import { useGetByIdMessage } from "../api/use-getById-message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useRef, useState } from "react";
import Quill from "quill";
import { useChannelId } from "@/hooks/use-channel-id";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { toast } from "sonner";
import { useGetMessages } from "../api/use-get-messages";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

// this gives me 5 min after which my messages will fall in default view else it will be compact view
const TIME_THRESHOLD = 2;

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type CreateMessageValues = {
  workspaceId: Id<"workSpaces">;
  channelId: Id<"channels">;
  parentMessageId: Id<"messages">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();

  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  //holds the reference to the Editor Component used below..
  const editorRef = useRef<Quill | null>(null);

  // Handle message creation and upload images.
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  // fetch details for a particular message.
  const { data: message, isLoading: loadingMessage } = useGetByIdMessage({
    id: messageId,
  });
  const { data: currentMember } = useCurrentMember({ id: workspaceId });

  // fetch paginated messages...
  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  // group messages based on sent-time -> {dateKey1: [message2, message1], ... }
  const groupedMessages = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd"); // a date key.
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  // displays the label under the message seperator --> with today, yesterday or normal date
  const formateDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MMMM d"); // date-formate
  };

  // handle submit of messages from editor..
  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);
      const values: CreateMessageValues = {
        workspaceId,
        channelId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      //check if image is aadded in Editor.
      // upload the image to convex _storage --> get the storageId --> put it in create Message Payload.
      if (image) {
        const url = await generateUploadUrl(
          {},
          {
            throwError: true,
          }
        );

        if (!url) {
          throw new Error("Url not Found");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json(); // get's the image's storageId

        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });

      setEditorKey((prev) => prev + 1); // it just triggers a render, added as key prop --> clears the editor.
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  // show loading message screen...
  if (loadingMessage || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold"> Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Thread header */}
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold"> Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      {/* Thread content */}
      {!message ? (
        // If message doesnot exsits..
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-10 text-red-500/50" />
          <p className="text-sm text-muted-foreground">Messages not found</p>
        </div>
      ) : (
        // This messages list view is in reverse order i.e flex-col-reverse.
        <div className="flex-1 flex flex-col-reverse pb-1 overflow-y-auto messages-scrollbar">
          <div className="px-4">
            <Editor
              key={editorKey}
              innerRef={editorRef}
              onSubmit={handleSubmit}
              disabled={isPending}
              placeholder="Reply.."
            />
          </div>
          <div>
            <Message
              hideThreadButton={true}
              memberId={message.memberId}
              authorImage={message.user.image}
              authorName={message.user.name}
              isAuthor={message.memberId === currentMember?._id}
              body={message.body}
              id={message._id}
              reactions={message.reactions}
              image={message.image}
              createdAt={message._creationTime}
              updatedAt={message.updatedAt}
              isEditing={editingId === message._id}
              setEditingId={setEditingId}
            />
            {Object.entries(groupedMessages || {})
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()) // fix: sorts the dateKey for proper order in ui
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
                        hideThreadButton={true}
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
                      if (entry.isIntersecting && status === "CanLoadMore") {
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
            {status === "LoadingMore" && (
              <div className="text-center my-2 relative">
                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                  <Loader className="size-4 animate-spin" />
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
